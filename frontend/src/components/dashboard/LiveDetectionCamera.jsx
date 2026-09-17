import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiVideo, FiPlay, FiSquare, FiRefreshCw, FiCamera, FiWifi, FiServer, FiCpu, FiUploadCloud, FiImage, FiFileText } from 'react-icons/fi';

import { useWebSocket } from '../../hooks/useWebSocket';
import { usePrediction as usePredictionContext } from '../../context/PredictionContext';
import api from '../../services/api';

// --- MediaPipe constants & indices ---
const face_indices = [1, 33, 263, 61, 291, 13, 14, 70, 300];

function extractLandmarks(results) {
  const pose = new Float32Array(52);
  const face = new Float32Array(27);
  const left_hand = new Float32Array(63);
  const right_hand = new Float32Array(63);

  if (results.poseLandmarks) {
    const sh_l = results.poseLandmarks[11];
    const sh_r = results.poseLandmarks[12];
    const mid_x = (sh_l.x + sh_r.x) / 2.0;
    const mid_y = (sh_l.y + sh_r.y) / 2.0;
    const mid_z = (sh_l.z + sh_r.z) / 2.0;
    for (let i = 0; i < 13; i++) {
      const lm = results.poseLandmarks[i];
      const idx = i * 4;
      pose[idx]     = lm.x - mid_x;
      pose[idx + 1] = lm.y - mid_y;
      pose[idx + 2] = lm.z - mid_z;
      pose[idx + 3] = lm.visibility || 0.0;
    }
  }

  if (results.faceLandmarks) {
    const nose = results.faceLandmarks[1];
    for (let i = 0; i < face_indices.length; i++) {
      const lm = results.faceLandmarks[face_indices[i]];
      const idx = i * 3;
      face[idx]     = lm.x - nose.x;
      face[idx + 1] = lm.y - nose.y;
      face[idx + 2] = lm.z - nose.z;
    }
  }

  if (results.leftHandLandmarks) {
    const wrist = results.leftHandLandmarks[0];
    for (let i = 0; i < 21; i++) {
      const lm = results.leftHandLandmarks[i];
      const idx = i * 3;
      left_hand[idx]     = lm.x - wrist.x;
      left_hand[idx + 1] = lm.y - wrist.y;
      left_hand[idx + 2] = lm.z - wrist.z;
    }
  }

  if (results.rightHandLandmarks) {
    const wrist = results.rightHandLandmarks[0];
    for (let i = 0; i < 21; i++) {
      const lm = results.rightHandLandmarks[i];
      const idx = i * 3;
      right_hand[idx]     = lm.x - wrist.x;
      right_hand[idx + 1] = lm.y - wrist.y;
      right_hand[idx + 2] = lm.z - wrist.z;
    }
  }

  const features = new Float32Array(205);
  features.set(pose, 0);
  features.set(face, 52);
  features.set(left_hand, 52 + 27);
  features.set(right_hand, 52 + 27 + 63);
  return Array.from(features);
}

function interpolateSequence(sequence, targetLength = 64) {
  const srcLen = sequence.length;
  if (srcLen === 0) return Array(targetLength).fill(Array(205).fill(0.0));
  if (srcLen === 1) return Array(targetLength).fill(sequence[0]);
  const res = [];
  for (let i = 0; i < targetLength; i++) {
    const progress  = i / (targetLength - 1);
    const floatIdx  = progress * (srcLen - 1);
    const idx1      = Math.floor(floatIdx);
    const idx2      = Math.min(Math.ceil(floatIdx), srcLen - 1);
    const weight    = floatIdx - idx1;
    const frame1    = sequence[idx1];
    const frame2    = sequence[idx2];
    const out       = new Array(205);
    for (let j = 0; j < 205; j++) {
      out[j] = frame1[j] * (1 - weight) + frame2[j] * weight;
    }
    res.push(out);
  }
  return res;
}

const StatusIndicator = ({ icon: Icon, label, status }) => {
  const dot   = status === 'online'      ? 'bg-success animate-pulse'
              : status === 'connecting'  ? 'bg-warning animate-pulse'
              : 'bg-danger';
  const text  = status === 'online'      ? 'text-success'
              : status === 'connecting'  ? 'text-warning'
              : 'text-danger';
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-card/80 px-3 py-2">
      <Icon size={16} className={text} />
      <span className="text-xs text-text-secondary">{label}</span>
      <div className={`w-2 h-2 rounded-full ${dot}`} />
    </div>
  );
};

// ── Persistent module-level MediaPipe Holistic instance ──────────────────────
let globalHolisticInstance = null;

const LiveDetectionCamera = () => {
  const [activeTab, setActiveTab]           = useState('live');
  const [isLive, setIsLive]                 = useState(false);
  const [backendStatus, setBackendStatus]   = useState('connecting');
  const [websocketStatus, setWsStatus]      = useState('connecting');
  const [cameraStatus, setCameraStatus]     = useState('offline');
  const [modelStatus]                       = useState('online');

  // Camera devices
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');

  // File states
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setImgPrev]  = useState(null);
  const [videoFile, setVideoFile]   = useState(null);
  const [videoPrev, setVideoPrev]   = useState(null);
  const [uploadLoading, setULd]     = useState(false);
  const [uploadError, setUErr]      = useState(null);

  // Sequence buffer
  const seqRef              = useRef([]);
  const noHandsCountRef     = useRef(0);
  const isLiveRef           = useRef(false);

  const videoRef            = useRef(null);
  const canvasRef           = useRef(null);
  const streamRef           = useRef(null);
  const mpCameraRef         = useRef(null);
  const rafRef              = useRef(null);

  const [isStreamReady, setIsStreamReady] = useState(false);
  const [webcamError, setWebcamError]     = useState(null);

  // ── WebSocket ──────────────────────────────────────────────────────────────
  const getWsUrl = () => {
    // Connect DIRECTLY to backend port 8000 — Vite proxy doesn't reliably
    // upgrade WebSocket connections on Windows. In production use same host.
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalDev) {
      return 'ws://127.0.0.1:8000/ws/predict';
    }
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${proto}//${window.location.host}/ws/predict`;
  };

  const { isConnected, send, onMessage } = useWebSocket(getWsUrl());
  const { addPrediction, predictionHistory } = usePredictionContext();

  useEffect(() => { setWsStatus(isConnected ? 'online' : 'connecting'); }, [isConnected]);

  // ── Backend health ─────────────────────────────────────────────────────────
  useEffect(() => {
    const checkHealth = (retries = 3) => {
      // Check directly against backend port 8000 in dev; via proxy in prod
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const healthUrl  = isLocalDev
        ? 'http://127.0.0.1:8000/api/label_map'
        : '/api/label_map';

      fetch(healthUrl)
        .then(r => { if (r.ok) setBackendStatus('online'); else throw new Error('not ok'); })
        .catch(() => {
          if (retries > 0) setTimeout(() => checkHealth(retries - 1), 2000);
          else setBackendStatus('offline');
        });
    };
    checkHealth();
  }, []);

  // ── Handle predictions from WebSocket ─────────────────────────────────────
  useEffect(() => {
    onMessage((data) => {
      if (data && data.word) {
        addPrediction({
          id: Date.now(),
          timestamp: new Date().toISOString(),
          gesture: data.word,
          confidence: parseFloat((data.confidence * 100).toFixed(1)),
          present: data.sentence || '',
          past: data.tenses?.past || '',
          future: data.tenses?.future || '',
          sentence: data.sentence || '',
          translation: data.translation || '',
          active_tense: data.active_tense || 'present',
          suggestions: data.suggestions || [],
          is_correct: data.is_correct,
          predictionStatus: data.is_correct ? 'Active' : 'Warning',
        });
      }
    });
  }, [onMessage, addPrediction]);

  // ── Device enumeration AFTER permission granted ────────────────────────────
  const refreshDevices = useCallback(async () => {
    try {
      const devices    = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(d => d.kind === 'videoinput');
      setAvailableCameras(videoInputs);

      // If we don't have a camera selected yet, auto-pick the best one
      setSelectedCameraId(prev => {
        if (prev) return prev; // keep user choice
        // Prefer integrated/webcam; skip virtual/droid
        const real = videoInputs.find(c => {
          const l = (c.label || '').toLowerCase();
          return !l.includes('droid') && !l.includes('virtual') && !l.includes('obs') && !l.includes('snap');
        });
        return real ? real.deviceId : (videoInputs[0]?.deviceId || '');
      });
    } catch (e) {
      console.warn('Device enumeration:', e);
    }
  }, []);

  useEffect(() => {
    refreshDevices();
    navigator.mediaDevices?.addEventListener?.('devicechange', refreshDevices);
    return () => navigator.mediaDevices?.removeEventListener?.('devicechange', refreshDevices);
  }, [refreshDevices]);

  // ── Camera start: multi-tier with permission-first ─────────────────────────
  const handleStartDetection = async (targetDeviceId = null) => {
    setIsLive(true);
    isLiveRef.current = true;
    setCameraStatus('connecting');
    setWebcamError(null);
    setIsStreamReady(false);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API not available. Use http://localhost:5173 in Chrome/Edge.');
      }

      let stream = null;
      const devId = targetDeviceId || selectedCameraId;

      // ── TIER 1: Try exact device the user selected ─────────────────────
      if (devId) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: devId }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
        } catch (_) {}
      }

      // ── TIER 2: Generic permission request (browser auto-picks) ───────
      // This also grants permission so we can re-enumerate with real labels
      if (!stream) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
        } catch (_) {}
      }

      // ── TIER 3: Minimal fallback ───────────────────────────────────────
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      // ── After permission is granted, re-enumerate for real labels ──────
      const afterDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs  = afterDevices.filter(d => d.kind === 'videoinput');
      setAvailableCameras(videoInputs);

      // Check if current stream is a DroidCam stream; if so, switch to real cam
      const currentTrack     = stream.getVideoTracks()[0];
      const currentLabel     = (currentTrack?.label || '').toLowerCase();
      const isDroidCamStream = currentLabel.includes('droid') || currentLabel.includes('virtual');

      if (isDroidCamStream) {
        // Stop DroidCam stream and try to get real camera
        stream.getTracks().forEach(t => t.stop());
        stream = null;

        const realCam = videoInputs.find(c => {
          const l = (c.label || '').toLowerCase();
          return !l.includes('droid') && !l.includes('virtual') && !l.includes('obs');
        });

        if (realCam) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: { exact: realCam.deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } },
              audio: false,
            });
            setSelectedCameraId(realCam.deviceId);
          } catch (e) {
            throw new Error(`Real camera "${realCam.label}" is in use by another app (e.g. Microsoft Edge, Teams, Zoom). Close those apps and retry.`);
          }
        } else {
          throw new Error('Only a virtual camera (DroidCam) was found. Please connect a real webcam.');
        }
      }

      if (!stream) throw new Error('Could not start any camera. Check permissions.');

      streamRef.current    = stream;
      const label = stream.getVideoTracks()[0]?.label || '';
      console.log('[Camera] Stream acquired:', label);

      // Update selected camera to reflect what's actually streaming
      const matchedDevice = videoInputs.find(d =>
        stream.getVideoTracks()[0]?.label === d.label
      );
      if (matchedDevice) setSelectedCameraId(matchedDevice.deviceId);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted     = true;
        videoRef.current.playsInline = true;
        await videoRef.current.play().catch(() => {});
      }

      setIsStreamReady(true);
      setCameraStatus('online');
    } catch (err) {
      console.error('[Camera] Error:', err);
      let msg = err.message || 'Failed to start camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission denied. Click the camera icon in your browser address bar and allow access, then retry.';
      } else if (err.name === 'NotFoundError') {
        msg = 'No webcam found on this computer.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        msg = 'Camera is in use by another application (Microsoft Edge, Teams, Zoom, etc.). Close those apps and click Retry.';
      }
      setWebcamError(msg);
      setCameraStatus('offline');
      setIsStreamReady(false);
    }
  };

  const handleSwitchCamera = async (newDeviceId) => {
    setSelectedCameraId(newDeviceId);
    if (!isLiveRef.current) return;
    // Stop current stream, restart with new device
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (mpCameraRef.current) { try { mpCameraRef.current.stop(); } catch(_){} mpCameraRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (videoRef.current)  { videoRef.current.srcObject = null; }
    setIsStreamReady(false);
    await handleStartDetection(newDeviceId);
  };

  const handleStopDetection = useCallback(() => {
    setIsLive(false);
    isLiveRef.current = false;
    setIsStreamReady(false);
    setCameraStatus('offline');
    if (rafRef.current)       { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (mpCameraRef.current)  { try { mpCameraRef.current.stop(); } catch(_){} mpCameraRef.current = null; }
    if (streamRef.current)    { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (videoRef.current)     { videoRef.current.srcObject = null; }
  }, []);

  const handleReconnect = () => {
    handleStopDetection();
    setTimeout(() => handleStartDetection(), 500);
  };

  // ── MediaPipe render loop ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isLive || !isStreamReady) return;

    let isMounted         = true;
    let isProcessing      = false;
    let lastVideoTime     = -1;

    const videoEl  = videoRef.current;
    const canvasEl = canvasRef.current;
    if (!videoEl || !canvasEl) return;

    // Wait for Holistic CDN script to load
    const waitForHolistic = () => new Promise((resolve) => {
      const check = () => {
        if (window.Holistic) return resolve();
        setTimeout(check, 200);
      };
      check();
    });

    const startPipeline = async () => {
      await waitForHolistic();
      if (!isMounted || !isLiveRef.current) return;

      const canvasCtx = canvasEl.getContext('2d');

      // Create or reuse global holistic instance
      if (!globalHolisticInstance) {
        globalHolisticInstance = new window.Holistic({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1675471629/${file}`,
        });
        globalHolisticInstance.setOptions({
          modelComplexity:        1,
          smoothLandmarks:        true,
          enableSegmentation:     false,
          smoothSegmentation:     false,
          refineFaceLandmarks:    false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence:  0.5,
        });
      }
      const holistic = globalHolisticInstance;

      holistic.onResults((results) => {
        if (!isMounted || !isLiveRef.current) return;

        // Resize canvas to match video
        if (videoEl.videoWidth && canvasEl.width !== videoEl.videoWidth) {
          canvasEl.width  = videoEl.videoWidth;
          canvasEl.height = videoEl.videoHeight;
        }

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);

        const drawConn = window.drawConnectors;
        const drawLm   = window.drawLandmarks;
        const POSE_C   = window.POSE_CONNECTIONS;
        const HAND_C   = window.HAND_CONNECTIONS;

        // Draw pose
        if (results.poseLandmarks) {
          if (drawConn && POSE_C) {
            drawConn(canvasCtx, results.poseLandmarks, POSE_C, { color: '#00f2fe', lineWidth: 2 });
            drawLm(canvasCtx, results.poseLandmarks, { color: '#0072ff', lineWidth: 1, radius: 3 });
          } else {
            canvasCtx.fillStyle = '#00f2fe';
            for (const lm of results.poseLandmarks) {
              if (lm && (lm.visibility || 0) > 0.3) {
                canvasCtx.beginPath();
                canvasCtx.arc(lm.x * canvasEl.width, lm.y * canvasEl.height, 4, 0, 2 * Math.PI);
                canvasCtx.fill();
              }
            }
          }
        }

        // Draw left hand
        if (results.leftHandLandmarks) {
          if (drawConn && HAND_C) {
            drawConn(canvasCtx, results.leftHandLandmarks, HAND_C, { color: '#22c55e', lineWidth: 2 });
            drawLm(canvasCtx, results.leftHandLandmarks, { color: '#22c55e', lineWidth: 1, radius: 3 });
          } else {
            canvasCtx.fillStyle = '#22c55e';
            for (const lm of results.leftHandLandmarks) {
              canvasCtx.beginPath();
              canvasCtx.arc(lm.x * canvasEl.width, lm.y * canvasEl.height, 4, 0, 2 * Math.PI);
              canvasCtx.fill();
            }
          }
        }

        // Draw right hand
        if (results.rightHandLandmarks) {
          if (drawConn && HAND_C) {
            drawConn(canvasCtx, results.rightHandLandmarks, HAND_C, { color: '#22c55e', lineWidth: 2 });
            drawLm(canvasCtx, results.rightHandLandmarks, { color: '#22c55e', lineWidth: 1, radius: 3 });
          } else {
            canvasCtx.fillStyle = '#22c55e';
            for (const lm of results.rightHandLandmarks) {
              canvasCtx.beginPath();
              canvasCtx.arc(lm.x * canvasEl.width, lm.y * canvasEl.height, 4, 0, 2 * Math.PI);
              canvasCtx.fill();
            }
          }
        }

        // Draw face points
        if (results.faceLandmarks) {
          canvasCtx.fillStyle = '#ffea00';
          for (const idx of face_indices) {
            const lm = results.faceLandmarks[idx];
            if (lm) {
              canvasCtx.beginPath();
              canvasCtx.arc(lm.x * canvasEl.width, lm.y * canvasEl.height, 2.5, 0, 2 * Math.PI);
              canvasCtx.fill();
            }
          }
        }
        canvasCtx.restore();

        // ── Sequence collection & prediction ─────────────────────────────
        const features  = extractLandmarks(results);
        const hasHands  = !!(results.leftHandLandmarks || results.rightHandLandmarks);

        if (hasHands) {
          noHandsCountRef.current = 0;
          seqRef.current.push(features);
          if (seqRef.current.length > 180) seqRef.current.shift();
        } else if (seqRef.current.length > 0) {
          noHandsCountRef.current++;
          seqRef.current.push(features);
          if (seqRef.current.length > 180) seqRef.current.shift();

          // SILENCE_DELAY = frames of no-hands before we finalize a sign
          // 8 frames ≈ ~270ms at 30fps — fast enough to catch short signs
          const SILENCE_DELAY = 8;
          if (noHandsCountRef.current >= SILENCE_DELAY) {
            const trimmed = seqRef.current.slice(0, -SILENCE_DELAY);
            seqRef.current          = [];
            noHandsCountRef.current = 0;

            // Need at least 20 frames (≈0.7s) for meaningful prediction
            if (trimmed.length >= 20) {
              const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
              const payload = {
                sequence:          interpolateSequence(trimmed, 64),
                history:           predictionHistory.map(p => p.gesture),
                lang:              'en',
                robust_mode:       true,
                // 50% threshold reduces false positives vs 35%
                confidence_thresh: 50.0,
              };

              if (isConnected) {
                send(payload);
              } else {
                // In dev, hit backend port 8000 directly
                const predictUrl = isLocalDev
                  ? 'http://127.0.0.1:8000/api/predict'
                  : '/api/predict';

                fetch(predictUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                })
                  .then(r => r.json())
                  .then(d => {
                    if (d?.word) {
                      addPrediction({
                        id: Date.now(),
                        timestamp: new Date().toISOString(),
                        gesture: d.word,
                        confidence: parseFloat((d.confidence * 100).toFixed(1)),
                        present: d.sentence || '',
                        past: d.tenses?.past || '',
                        future: d.tenses?.future || '',
                        sentence: d.sentence || '',
                        translation: d.translation || '',
                        active_tense: d.active_tense || 'present',
                        suggestions: d.suggestions || [],
                        is_correct: d.is_correct,
                        predictionStatus: d.is_correct ? 'Active' : 'Warning',
                      });
                    }
                  })
                  .catch(() => {});
              }
            }
          }
        }
      });

      // ── rAF render loop ───────────────────────────────────────────────
      const renderLoop = async () => {
        if (!isMounted || !isLiveRef.current) return;

        if (videoEl.readyState >= 2 && videoEl.videoWidth > 0 && !videoEl.paused) {
          if (videoEl.currentTime !== lastVideoTime && !isProcessing) {
            lastVideoTime = videoEl.currentTime;
            isProcessing  = true;
            try {
              await holistic.send({ image: videoEl });
            } catch (_) {}
            isProcessing = false;
          }
        } else if (videoEl.paused && isLiveRef.current) {
          videoEl.play().catch(() => {});
        }

        rafRef.current = requestAnimationFrame(renderLoop);
      };

      renderLoop();

      mpCameraRef.current = { stop: () => {} };
    };

    startPipeline();

    return () => {
      isMounted = false;
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLive, isStreamReady]);

  useEffect(() => () => handleStopDetection(), [handleStopDetection]);

  // ── Image upload ───────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImgPrev(URL.createObjectURL(file)); setUErr(null); }
  };
  const handleUploadImage = async () => {
    if (!imageFile) return;
    setULd(true); setUErr(null);
    const fd = new FormData(); fd.append('file', imageFile);
    try {
      const res  = await api.post('/api/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const d    = res.data;
      addPrediction({ id: Date.now(), timestamp: new Date().toISOString(), gesture: d.word,
        confidence: parseFloat((d.confidence * 100).toFixed(1)), present: d.sentence || '',
        past: d.tenses?.past || '', future: d.tenses?.future || '',
        sentence: d.sentence || '', translation: d.translation || '',
        active_tense: d.active_tense || 'present', suggestions: d.suggestions || [],
        is_correct: d.is_correct, predictionStatus: d.is_correct ? 'Active' : 'Warning' });
    } catch (err) { setUErr(err.response?.data?.detail || 'Upload failed'); }
    finally { setULd(false); }
  };

  // ── Video upload ───────────────────────────────────────────────────────────
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) { setVideoFile(file); setVideoPrev(URL.createObjectURL(file)); setUErr(null); }
  };
  const handleUploadVideo = async () => {
    if (!videoFile) return;
    setULd(true); setUErr(null);
    const fd = new FormData(); fd.append('file', videoFile);
    try {
      const res  = await api.post('/api/upload/video', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const d    = res.data;
      addPrediction({ id: Date.now(), timestamp: new Date().toISOString(), gesture: d.word,
        confidence: parseFloat((d.confidence * 100).toFixed(1)), present: d.sentence || '',
        past: d.tenses?.past || '', future: d.tenses?.future || '',
        sentence: d.sentence || '', translation: d.translation || '',
        active_tense: d.active_tense || 'present', suggestions: d.suggestions || [],
        is_correct: d.is_correct, predictionStatus: d.is_correct ? 'Active' : 'Warning' });
    } catch (err) { setUErr(err.response?.data?.detail || 'Upload failed'); }
    finally { setULd(false); }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl border border-border p-6 shadow-glow-sm"
    >
      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        {[
          { key: 'live',  Icon: FiVideo,    label: 'Live Camera Feed' },
          { key: 'image', Icon: FiImage,    label: 'Upload Image' },
          { key: 'video', Icon: FiFileText, label: 'Upload Video' },
        ].map(({ key, Icon, label }) => (
          <button key={key}
            onClick={() => { handleStopDetection(); setActiveTab(key); }}
            className={`flex-1 pb-4 text-sm font-semibold flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              activeTab === key ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text'
            }`}
          >
            <Icon /><span>{label}</span>
          </button>
        ))}
      </div>

      {/* ── LIVE tab ──────────────────────────────────────────────────────── */}
      {activeTab === 'live' && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">AI Camera Preview</h3>
              {availableCameras.length > 0 && (
                <div className="flex items-center gap-1.5 bg-card/80 border border-border rounded-xl px-2.5 py-1">
                  <FiCamera size={13} className="text-primary" />
                  <select
                    value={selectedCameraId}
                    onChange={e => handleSwitchCamera(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-text outline-none cursor-pointer max-w-[200px] truncate"
                    title="Select Camera"
                  >
                    {availableCameras.map((cam, i) => (
                      <option key={cam.deviceId || i} value={cam.deviceId} className="bg-card text-text">
                        {cam.label || `Camera ${i + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {isLive && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-danger/20 border border-danger/50">
                <span className="w-3 h-3 rounded-full bg-danger animate-pulse" />
                <span className="text-danger text-sm font-semibold">LIVE</span>
              </motion.div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <StatusIndicator icon={FiServer}  label="Backend"   status={backendStatus}   />
            <StatusIndicator icon={FiWifi}    label="WebSocket" status={websocketStatus} />
            <StatusIndicator icon={FiVideo}   label="Camera"    status={cameraStatus}    />
            <StatusIndicator icon={FiCpu}     label="Model"     status={modelStatus}     />
          </div>

          <div className="relative aspect-video bg-card rounded-2xl overflow-hidden border-2 border-border mb-4">
            {/* Video element — always mounted */}
            <video
              ref={videoRef}
              autoPlay playsInline muted
              className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${
                isLive && isStreamReady ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Canvas landmark overlay */}
            <canvas
              ref={canvasRef}
              className={`absolute top-0 left-0 w-full h-full object-cover pointer-events-none scale-x-[-1] ${
                isLive && isStreamReady ? 'block' : 'hidden'
              }`}
            />

            {/* Idle placeholder */}
            {!isLive && !webcamError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-card">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                  <FiVideo size={48} className="text-text-secondary" />
                </div>
                <p className="text-text-secondary text-lg mb-2">Camera is off</p>
                <p className="text-text-secondary text-sm">Click "Start Detection" to begin</p>
              </div>
            )}

            {/* Loading overlay */}
            {isLive && !isStreamReady && !webcamError && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-base font-semibold text-white">Starting Camera & AI…</p>
                <p className="text-xs text-text-secondary mt-1">Allow camera access if prompted</p>
              </div>
            )}

            {/* Error overlay */}
            {webcamError && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-card/95 p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center text-danger mb-3">
                  <FiVideo size={28} />
                </div>
                <h4 className="text-base font-bold text-white mb-1">Camera Error</h4>
                <p className="text-xs text-text-secondary max-w-md mb-4">{webcamError}</p>
                <div className="bg-darkBg/80 border border-border rounded-xl p-3 text-left text-xs max-w-sm mb-4 space-y-1 text-text-secondary">
                  <p className="font-semibold text-warning">Steps to fix:</p>
                  <p>1. Close Microsoft Edge, Teams, or Zoom (they lock the camera)</p>
                  <p>2. Click the 🔒 in Chrome's address bar → allow Camera</p>
                  <p>3. Select your "Integrated Camera" from the dropdown</p>
                  <p>4. Click <strong>Retry Camera</strong> below</p>
                </div>
                <button onClick={handleReconnect}
                  className="btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2">
                  <FiRefreshCw size={14} /> Retry Camera
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {!isLive ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => handleStartDetection()}
                className="flex-1 min-w-[200px] btn-primary py-4 rounded-xl text-white font-semibold flex items-center justify-center space-x-2">
                <FiPlay size={20} /><span>Start Detection</span>
              </motion.button>
            ) : (
              <>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleStopDetection}
                  className="flex-1 min-w-[200px] bg-danger hover:bg-danger/90 py-4 rounded-xl text-white font-semibold flex items-center justify-center space-x-2 transition-colors">
                  <FiSquare size={20} /><span>Stop Detection</span>
                </motion.button>
                <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleReconnect}
                  className="px-6 py-4 rounded-xl bg-card border border-border hover:border-primary transition-colors flex items-center space-x-2">
                  <FiRefreshCw size={20} /><span className="hidden sm:inline">Reconnect</span>
                </motion.button>
              </>
            )}
          </div>
        </>
      )}

      {/* ── IMAGE upload tab ───────────────────────────────────────────────── */}
      {activeTab === 'image' && (
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Static ASL Image Translation</h3>
          <div className="border-2 border-dashed border-border rounded-2xl aspect-video relative overflow-hidden bg-card/40 flex flex-col items-center justify-center p-6 mb-6 hover:border-primary/50 transition-colors">
            {imagePreview
              ? <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
              : (
                <div className="flex flex-col items-center text-center">
                  <FiUploadCloud size={48} className="text-primary mb-3 animate-pulse" />
                  <p className="text-sm font-semibold mb-1">Drag & drop your image here</p>
                  <p className="text-xs text-text-secondary mb-4">Supports JPEG, PNG up to 10 MB</p>
                  <label className="btn bg-primary hover:bg-primary/95 text-white font-bold text-xs px-4 py-2.5 rounded-lg cursor-pointer">
                    Browse Files
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              )
            }
          </div>
          {uploadError && <div className="p-3 mb-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs">{uploadError}</div>}
          <div className="flex space-x-3">
            <button onClick={handleUploadImage} disabled={!imageFile || uploadLoading}
              className="flex-1 btn-primary py-3 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
              {uploadLoading ? <span>Processing…</span> : <span>Predict Uploaded Image</span>}
            </button>
            {imageFile && (
              <button onClick={() => { setImageFile(null); setImgPrev(null); setUErr(null); }}
                className="px-6 py-3 rounded-xl bg-card border border-border hover:border-primary/50">Clear</button>
            )}
          </div>
        </div>
      )}

      {/* ── VIDEO upload tab ───────────────────────────────────────────────── */}
      {activeTab === 'video' && (
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Static ASL Video Translation</h3>
          <div className="border-2 border-dashed border-border rounded-2xl aspect-video relative overflow-hidden bg-card/40 flex flex-col items-center justify-center p-6 mb-6 hover:border-primary/50 transition-colors">
            {videoPrev
              ? <video src={videoPrev} controls className="w-full h-full object-contain" />
              : (
                <div className="flex flex-col items-center text-center">
                  <FiUploadCloud size={48} className="text-primary mb-3 animate-pulse" />
                  <p className="text-sm font-semibold mb-1">Drag & drop your sign video here</p>
                  <p className="text-xs text-text-secondary mb-4">Supports MP4, MOV up to 50 MB</p>
                  <label className="btn bg-primary hover:bg-primary/95 text-white font-bold text-xs px-4 py-2.5 rounded-lg cursor-pointer">
                    Browse Files
                    <input type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
                  </label>
                </div>
              )
            }
          </div>
          {uploadError && <div className="p-3 mb-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs">{uploadError}</div>}
          <div className="flex space-x-3">
            <button onClick={handleUploadVideo} disabled={!videoFile || uploadLoading}
              className="flex-1 btn-primary py-3 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
              {uploadLoading ? <span>Extracting & predicting…</span> : <span>Predict Uploaded Video</span>}
            </button>
            {videoFile && (
              <button onClick={() => { setVideoFile(null); setVideoPrev(null); setUErr(null); }}
                className="px-6 py-3 rounded-xl bg-card border border-border hover:border-primary/50">Clear</button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(LiveDetectionCamera);

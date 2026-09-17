import { useState, useCallback, useRef, useEffect } from 'react';

export const useWebcam = () => {
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('user');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [constraintTier, setConstraintTier] = useState(0);

  // Progressive constraints: ideal 720p -> ideal 480p -> facingMode only -> boolean true
  const getVideoConstraints = useCallback(() => {
    if (constraintTier === 0) {
      return {
        width: { ideal: 1280, min: 480 },
        height: { ideal: 720, min: 360 },
        facingMode: facingMode,
      };
    } else if (constraintTier === 1) {
      return {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: facingMode,
      };
    } else if (constraintTier === 2) {
      return {
        facingMode: facingMode,
      };
    } else {
      return true;
    }
  }, [constraintTier, facingMode]);

  const videoConstraints = getVideoConstraints();

  const handleUserMedia = useCallback(() => {
    setIsStreamReady(true);
    setIsCameraOn(true);
    setError(null);
  }, []);

  const handleUserMediaError = useCallback((err) => {
    console.error(`Webcam error (tier ${constraintTier}):`, err);

    // If constraint failed, automatically step down to a more permissive tier
    const isConstraintErr =
      err?.name === 'OverconstrainedError' ||
      err?.name === 'ConstraintNotSatisfiedError' ||
      (typeof err?.message === 'string' && err.message.toLowerCase().includes('constraint'));

    if (isConstraintErr && constraintTier < 3) {
      console.warn(`Constraint tier ${constraintTier} not supported, trying fallback tier ${constraintTier + 1}...`);
      setConstraintTier((prev) => prev + 1);
      return;
    }

    let userMessage = 'Camera access failed.';
    if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
      userMessage = 'Camera permission denied. Please allow camera access in your browser.';
    } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
      userMessage = 'No camera device found on this system.';
    } else if (err?.name === 'NotReadableError' || err?.name === 'TrackStartError') {
      userMessage = 'Camera is currently in use by another application or blocked.';
    } else if (typeof err === 'string') {
      userMessage = err;
    } else if (err?.message) {
      userMessage = err.message;
    }

    setError(userMessage);
    setIsStreamReady(false);
    setIsCameraOn(false);
  }, [constraintTier]);

  const startCamera = useCallback(() => {
    setError(null);
    setConstraintTier(0);
    setIsCameraOn(true);
  }, []);

  const stopCamera = useCallback(() => {
    if (webcamRef.current) {
      if (webcamRef.current.stream) {
        const tracks = webcamRef.current.stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (webcamRef.current.video && webcamRef.current.video.srcObject) {
        const stream = webcamRef.current.video.srcObject;
        if (stream && stream.getTracks) {
          stream.getTracks().forEach((track) => track.stop());
        }
        webcamRef.current.video.srcObject = null;
      }
    }
    setIsStreamReady(false);
    setIsCameraOn(false);
    setError(null);
  }, []);

  const captureFrame = useCallback(() => {
    if (webcamRef.current) {
      return webcamRef.current.getScreenshot();
    }
    return null;
  }, []);

  const switchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    webcamRef,
    isStreamReady,
    isCameraOn,
    error,
    videoConstraints,
    captureFrame,
    switchCamera,
    startCamera,
    stopCamera,
    handleUserMedia,
    handleUserMediaError,
  };
};

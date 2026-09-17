# extract_features.py

import cv2
import numpy as np
from scipy.interpolate import interp1d
from Gest_Landmark import process_frame, FEATURE_SIZE


def extract_features_from_video(video_path, frame_start, frame_end, target_frames=64):
    """
    Video ke specific frame range se MediaPipe features extract karta hai
    aur ek fixed-length sequence (target_frames, 205) return karta hai.

    Args:
        video_path   : path to .mp4 file
        frame_start  : starting frame index (1-based, as in WLASL JSON)
        frame_end    : ending frame index (-1 means read till end)
        target_frames: output sequence length (default 64)

    Returns:
        np.ndarray of shape (target_frames, FEATURE_SIZE)  or  None on failure
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"  [Error] Could not open: {video_path}")
        return None

    # Seek to start frame (WLASL is 1-based → subtract 1)
    if frame_start > 1:
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_start - 1)

    features_list = []
    frame_idx = frame_start

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        _, features = process_frame(frame)   # always returns (205,)
        features_list.append(features)

        frame_idx += 1
        if frame_end != -1 and frame_idx > frame_end:
            break

    cap.release()

    if len(features_list) == 0:
        print(f"  [Warning] No frames extracted from: {video_path}")
        return None

    features_arr = np.array(features_list, dtype=np.float32)  # (N, 205)

    # ── Interpolate to fixed target_frames ──
    if len(features_arr) == 1:
        # Edge case: single frame → tile it
        normalized = np.tile(features_arr, (target_frames, 1))
    elif len(features_arr) == target_frames:
        normalized = features_arr
    else:
        src_indices = np.arange(len(features_arr))
        dst_indices = np.linspace(0, len(features_arr) - 1, target_frames)
        f = interp1d(src_indices, features_arr, axis=0, kind='linear')
        normalized = f(dst_indices).astype(np.float32)  # (target_frames, 205)

    assert normalized.shape == (target_frames, FEATURE_SIZE), \
        f"Shape mismatch: {normalized.shape}"

    return normalized

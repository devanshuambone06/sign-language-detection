# Gest_Landmark.py

import cv2
import numpy as np
import mediapipe.python.solutions.holistic as mp_holistic
import mediapipe.python.solutions.drawing_utils as mp_drawing

# ──────────────────────────────────────────────
# MEDIAPIPE HOLISTIC SETUP
# ──────────────────────────────────────────────
holistic = mp_holistic.Holistic(
    static_image_mode=False,
    model_complexity=0,
    smooth_landmarks=False,
    enable_segmentation=False,
    refine_face_landmarks=False,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# ──────────────────────────────────────────────
# OPTIMIZED FEATURE VECTOR SIZE BREAKDOWN
# pose (Upper Body Only) : 13 × 4  =  52  (Landmarks 0 to 12 capture head & shoulders)
# face                   :  9 × 3  =  27
# left_hand              : 21 × 3  =  63
# right_hand             : 21 × 3  =  63
# TOTAL                            = 205
# ──────────────────────────────────────────────
FEATURE_SIZE = 205

# Important facial landmarks (reduced from 468 → 9 for better FPS)
IMPORTANT_FACE_POINTS = [1, 33, 263, 61, 291, 13, 14, 70, 300] 

# Drawing colors (BGR)
HAND_COLOR = (0, 255, 0)    # green
POSE_COLOR = (255, 0, 0)    # blue
FACE_COLOR = (0, 255, 255)  # yellow

# ──────────────────────────────────────────────
# LANDMARK EXTRACTION & NORMALIZATION
# ──────────────────────────────────────────────
def extract_landmarks(results):
    """
    Returns a flat, normalized numpy array of shape (205,).
    Coordinates are normalized relative to key anchor points to improve accuracy.
    """
    pose       = np.zeros(13 * 4)                          # 52 (Upper body only)
    face       = np.zeros(len(IMPORTANT_FACE_POINTS) * 3)  # 27
    left_hand  = np.zeros(21 * 3)                          # 63
    right_hand = np.zeros(21 * 3)                          # 63

    # 1. Upper Body Pose (0 to 12 endpoints cover head, shoulders, elbows, wrists)
    # Normalized relative to the midpoint of the shoulders to make it shift/scale invariant
    if results.pose_landmarks:
        # Landmark 11 is left shoulder, 12 is right shoulder
        sh_l = results.pose_landmarks.landmark[11]
        sh_r = results.pose_landmarks.landmark[12]
        mid_x = (sh_l.x + sh_r.x) / 2.0
        mid_y = (sh_l.y + sh_r.y) / 2.0
        mid_z = (sh_l.z + sh_r.z) / 2.0
        
        pose_pts = []
        for i in range(13): 
            lm = results.pose_landmarks.landmark[i]
            pose_pts.extend([lm.x - mid_x, lm.y - mid_y, lm.z - mid_z, lm.visibility])
        pose = np.array(pose_pts)

    # 2. Face Points (Normalized relative to nose tip)
    if results.face_landmarks:
        nose = results.face_landmarks.landmark[1] 
        face_points = []
        for idx in IMPORTANT_FACE_POINTS:
            lm = results.face_landmarks.landmark[idx]
            face_points.extend([lm.x - nose.x, lm.y - nose.y, lm.z - nose.z])
        face = np.array(face_points)

    # 3. Left Hand (Normalized relative to Left Wrist)
    if results.left_hand_landmarks:
        wrist = results.left_hand_landmarks.landmark[0] 
        left_hand = np.array([
            [lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z]
            for lm in results.left_hand_landmarks.landmark
        ]).flatten()

    # 4. Right Hand (Normalized relative to Right Wrist)
    if results.right_hand_landmarks:
        wrist = results.right_hand_landmarks.landmark[0] 
        right_hand = np.array([
            [lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z]
            for lm in results.right_hand_landmarks.landmark
        ]).flatten()

    features = np.concatenate([pose, face, left_hand, right_hand])

    assert features.shape[0] == FEATURE_SIZE, \
        f"Feature size mismatch: expected {FEATURE_SIZE}, got {features.shape[0]}"

    return features

# ──────────────────────────────────────────────
# FRAME PROCESSING
# ──────────────────────────────────────────────
def process_frame(frame):
    """
    Returns:
        frame    : annotated BGR frame
        features : np.ndarray (205,) — always returned
    """
    # Resize frame for significantly faster CPU landmark processing (reduces latency)
    frame = cv2.resize(frame, (480, 360))
    frame = cv2.flip(frame, 1) 
    rgb   = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    rgb.flags.writeable = False
    results = holistic.process(rgb)
    rgb.flags.writeable = True

    frame = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    h, w, _ = frame.shape

    # Draw Pose
    if results.pose_landmarks:
        mp_drawing.draw_landmarks(
            frame, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
            landmark_drawing_spec=mp_drawing.DrawingSpec(color=POSE_COLOR, thickness=2, circle_radius=2),
            connection_drawing_spec=mp_drawing.DrawingSpec(color=POSE_COLOR, thickness=2)
        )

    # Draw Hands
    for hand_landmarks, connections in [
        (results.left_hand_landmarks,  mp_holistic.HAND_CONNECTIONS),
        (results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS),
    ]:
        if hand_landmarks:
            mp_drawing.draw_landmarks(
                frame, hand_landmarks, connections,
                landmark_drawing_spec=mp_drawing.DrawingSpec(color=HAND_COLOR, thickness=2, circle_radius=2),
                connection_drawing_spec=mp_drawing.DrawingSpec(color=HAND_COLOR, thickness=2)
            )

    # Draw important face points
    if results.face_landmarks:
        for idx in IMPORTANT_FACE_POINTS:
            lm = results.face_landmarks.landmark[idx]
            cx, cy = int(lm.x * w), int(lm.y * h)
            cv2.circle(frame, (cx, cy), 2, FACE_COLOR, -1)

    features = extract_landmarks(results)
    return frame, features

# build_dataset.py

import json
import numpy as np
import os
from extract_features import extract_features_from_video

# ──────────────────────────────────────────────
# CONFIG
# ──────────────────────────────────────────────
VIDEO_DIR     = "videos/"
NSLT_FILE     = "nslt_100.json"     # 100-sign subset
WLASL_FILE    = "WLASL_v0.3.json"
OUTPUT_FILE   = "features_dataset.npz"
TARGET_FRAMES = 64

# ──────────────────────────────────────────────
# LOAD JSONs
# ──────────────────────────────────────────────
with open(WLASL_FILE) as f:
    wlasl = json.load(f)

with open(NSLT_FILE) as f:
    nslt = json.load(f)

# ──────────────────────────────────────────────
# BUILD video_id → metadata MAP from WLASL
# ──────────────────────────────────────────────
video_info = {}
for entry in wlasl:
    gloss = entry['gloss']
    for inst in entry['instances']:
        video_info[inst['video_id']] = {
            'gloss':       gloss,
            'frame_start': inst.get('frame_start', 1),
            'frame_end':   inst.get('frame_end', -1),
            'bbox':        inst.get('bbox', [])
        }

# ──────────────────────────────────────────────
# BUILD LABEL MAP
# Only include glosses that actually appear in NSLT
# ──────────────────────────────────────────────
valid_glosses = sorted(set(
    video_info[vid]['gloss']
    for vid in nslt
    if vid in video_info
))
label_map = {gloss: i for i, gloss in enumerate(valid_glosses)}
print(f"Total classes : {len(label_map)}")
print(f"Total videos  : {len(nslt)}\n")

# ──────────────────────────────────────────────
# EXTRACT FEATURES
# ──────────────────────────────────────────────
X, y, splits = [], [], []
skipped = 0

for video_id, meta in nslt.items():

    # nslt_100.json structure: {"video_id": {"subset": "train/val/test"}}
    subset = meta.get('subset', 'train') if isinstance(meta, dict) else meta

    video_path = os.path.join(VIDEO_DIR, f"{video_id}.mp4")
    if not os.path.exists(video_path):
        print(f"  [Warning] Missing : {video_id}.mp4")
        skipped += 1
        continue

    info = video_info.get(video_id)
    if not info:
        print(f"  [Warning] No WLASL entry for: {video_id}")
        skipped += 1
        continue

    if info['gloss'] not in label_map:
        skipped += 1
        continue

    features = extract_features_from_video(
        video_path,
        info['frame_start'],
        info['frame_end'],
        target_frames=TARGET_FRAMES
    )

    if features is None:
        skipped += 1
        continue

    label = label_map[info['gloss']]
    X.append(features)
    y.append(label)
    splits.append(subset)
    print(f"  [OK]  {video_id:15s} | {info['gloss']:20s} | label={label:3d} | split={subset}")

# ──────────────────────────────────────────────
# SAVE
# ──────────────────────────────────────────────
print(f"\nTotal extracted : {len(X)}")
print(f"Total skipped   : {skipped}")

if len(X) == 0:
    print("❌ No samples extracted. Check VIDEO_DIR and JSON files.")
else:
    np.savez_compressed(
        OUTPUT_FILE,
        X          = np.array(X,      dtype=np.float32),   # (N, 64, 285)
        y          = np.array(y,      dtype=np.int32),      # (N,)
        splits     = np.array(splits, dtype=object),        # (N,) 'train'/'val'/'test'
        label_map  = json.dumps(label_map)
    )
    print(f"[OK] Saved {len(X)} samples -> {OUTPUT_FILE}")

    # Save label_map separately too (needed by inference)
    with open('label_map.json', 'w') as f:
        json.dump(label_map, f, indent=2)
    print("[OK] label_map.json saved")

# train_model.py

import numpy as np
import json
import tensorflow as tf

# ──────────────────────────────────────────────
# LOAD DATASET
# ──────────────────────────────────────────────
data = np.load("features_dataset.npz", allow_pickle=True)

X      = data['X'].astype(np.float32)   # (N, 64, 205)
y      = data['y'].astype(np.int32)     # (N,)
splits = data['splits']
label_map   = json.loads(str(data['label_map']))
num_classes = len(label_map)

print(f"Dataset loaded  : X={X.shape}, y={y.shape}")
print(f"Num classes     : {num_classes}")

# ──────────────────────────────────────────────
# SCALE-INVARIANT FEATURE NORMALIZATION
# ──────────────────────────────────────────────
def normalize_features(X_data):
    X_norm = X_data.copy()
    num_samples = X_norm.shape[0]
    
    # 1. Pose landmarks (indices 0:52 -> 13 landmarks, each x, y, z, visibility)
    # Normalized relative to shoulder width (distance between landmark 11 and 12)
    pose = X_norm[:, :, 0:52].reshape(num_samples, 64, 13, 4)
    sh_l = pose[:, :, 11, :3] # Left shoulder (N, 64, 3)
    sh_r = pose[:, :, 12, :3] # Right shoulder (N, 64, 3)
    sh_width = np.linalg.norm(sh_l - sh_r, axis=-1, keepdims=True) # (N, 64, 1)
    sh_width = np.where(sh_width > 1e-5, sh_width, 1.0)
    # Divide x, y, z by sh_width
    pose[:, :, :, :3] = pose[:, :, :, :3] / sh_width[:, :, np.newaxis, :]
    X_norm[:, :, 0:52] = pose.reshape(num_samples, 64, 52)
    
    # 2. Left hand (indices 79:142 -> 21 landmarks, each x, y, z)
    # Normalized relative to hand scale (mean distance from wrist)
    lh = X_norm[:, :, 79:142].reshape(num_samples, 64, 21, 3)
    lh_dists = np.linalg.norm(lh, axis=-1) # (N, 64, 21)
    lh_scale = np.mean(lh_dists, axis=-1, keepdims=True) # (N, 64, 1)
    lh_scale = np.where(lh_scale > 1e-5, lh_scale, 1.0)
    lh = lh / lh_scale[:, :, :, np.newaxis]
    X_norm[:, :, 79:142] = lh.reshape(num_samples, 64, 63)
    
    # 3. Right hand (indices 142:205 -> 21 landmarks, each x, y, z)
    # Normalized relative to hand scale (mean distance from wrist)
    rh = X_norm[:, :, 142:205].reshape(num_samples, 64, 21, 3)
    rh_dists = np.linalg.norm(rh, axis=-1) # (N, 64, 21)
    rh_scale = np.mean(rh_dists, axis=-1, keepdims=True) # (N, 64, 1)
    rh_scale = np.where(rh_scale > 1e-5, rh_scale, 1.0)
    rh = rh / rh_scale[:, :, :, np.newaxis]
    X_norm[:, :, 142:205] = rh.reshape(num_samples, 64, 63)
    
    return X_norm

print("Applying scale-invariant normalization...")
X = normalize_features(X)

# ──────────────────────────────────────────────
# TRAIN / VAL SPLIT
# ──────────────────────────────────────────────
train_mask = splits == 'train'
val_mask   = splits == 'val'
test_mask  = splits == 'test'

X_train, y_train = X[train_mask], y[train_mask]
X_val,   y_val   = X[val_mask],   y[val_mask]
X_test,  y_test  = X[test_mask],  y[test_mask]

# Data Augmentation to prevent overfitting and boost validation accuracy
def augment_data(X_data, y_data, num_augments=7):
    X_list = [X_data]
    y_list = [y_data]
    num_samples, num_frames, num_features = X_data.shape
    
    for _ in range(num_augments):
        # 1. Add tiny Gaussian noise to landmarks
        noise = np.random.normal(0, 0.003, X_data.shape).astype(np.float32)
        X_noisy = X_data + noise
        
        # 2. Scale landmarks slightly
        scale = np.random.uniform(0.95, 1.05, (num_samples, 1, num_features)).astype(np.float32)
        X_scaled = X_noisy * scale
        
        # 3. Temporal shifting (roll along the frame axis)
        for i in range(num_samples):
            shift = np.random.randint(-4, 5)  # Shift sequence by -4 to +4 frames
            X_scaled[i] = np.roll(X_scaled[i], shift, axis=0)
            if shift > 0:
                X_scaled[i, :shift] = 0.0
            elif shift < 0:
                X_scaled[i, shift:] = 0.0
                
            # 4. Temporal Masking (Frame Dropout) - 50% probability
            if np.random.rand() < 0.5:
                mask_len = np.random.randint(4, 9) # mask 4 to 8 frames
                start_frame = np.random.randint(0, num_frames - mask_len)
                X_scaled[i, start_frame:start_frame+mask_len, :] = 0.0
                
            # 5. Hand Sensor Dropout - 15% probability of dropping one hand
            if np.random.rand() < 0.15:
                X_scaled[i, :, 79:142] = 0.0
            if np.random.rand() < 0.15:
                X_scaled[i, :, 142:205] = 0.0
                
            # 6. Time warping (random speed up / slow down) - 40% probability
            if np.random.rand() < 0.4:
                speed_factor = np.random.uniform(0.8, 1.25)
                new_len = int(num_frames * speed_factor)
                src_idx = np.arange(num_frames)
                dst_idx = np.linspace(0, num_frames - 1, new_len)
                
                from scipy.interpolate import interp1d
                f_interp = interp1d(src_idx, X_scaled[i], axis=0, kind='linear', fill_value="extrapolate")
                warped = f_interp(dst_idx).astype(np.float32)
                
                if len(warped) >= num_frames:
                    start = (len(warped) - num_frames) // 2
                    X_scaled[i] = warped[start:start+num_frames]
                else:
                    pad_len = num_frames - len(warped)
                    pad_before = pad_len // 2
                    pad_after = pad_len - pad_before
                    X_scaled[i] = np.pad(warped, ((pad_before, pad_after), (0, 0)), mode='constant')
                    
        X_list.append(X_scaled)
        y_list.append(y_data)
        
    return np.concatenate(X_list, axis=0), np.concatenate(y_list, axis=0)

X_train, y_train = augment_data(X_train, y_train, num_augments=7)

# Shuffle augmented training data
indices = np.arange(X_train.shape[0])
np.random.shuffle(indices)
X_train = X_train[indices]
y_train = y_train[indices]

print(f"Train (Augmented): {X_train.shape[0]}  |  Val: {X_val.shape[0]}  |  Test: {X_test.shape[0]}")

# One-hot encode
y_train = tf.keras.utils.to_categorical(y_train, num_classes)
y_val   = tf.keras.utils.to_categorical(y_val,   num_classes)
y_test  = tf.keras.utils.to_categorical(y_test,  num_classes)

# ──────────────────────────────────────────────
# MODEL (CNN + BiLSTM + Attention Architecture)
# ──────────────────────────────────────────────
inputs = tf.keras.Input(shape=(64, X.shape[2]))

# Conv1D blocks for local spatial-temporal features
x = tf.keras.layers.Conv1D(64, kernel_size=3, padding='same', activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.0015))(inputs)
x = tf.keras.layers.BatchNormalization()(x)
x = tf.keras.layers.Dropout(0.3)(x)

# Stacked Bidirectional LSTMs
x = tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64, return_sequences=True, kernel_regularizer=tf.keras.regularizers.l2(0.0015)))(x)
x = tf.keras.layers.BatchNormalization()(x)
x = tf.keras.layers.Dropout(0.4)(x)

x = tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64, return_sequences=True, kernel_regularizer=tf.keras.regularizers.l2(0.0015)))(x)
x = tf.keras.layers.BatchNormalization()(x)
x = tf.keras.layers.Dropout(0.4)(x)

# Multi-head Attention
attn = tf.keras.layers.MultiHeadAttention(num_heads=2, key_dim=32)(x, x)
x = tf.keras.layers.Add()([x, attn])
x = tf.keras.layers.BatchNormalization()(x)

# Pooling
gap = tf.keras.layers.GlobalAveragePooling1D()(x)
gmp = tf.keras.layers.GlobalMaxPooling1D()(x)
merged = tf.keras.layers.Concatenate()([gap, gmp])

# Dense classifier
dense = tf.keras.layers.Dense(128, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.0015))(merged)
dense = tf.keras.layers.BatchNormalization()(dense)
dense = tf.keras.layers.Dropout(0.4)(dense)

outputs = tf.keras.layers.Dense(num_classes, activation='softmax')(dense)

model = tf.keras.Model(inputs=inputs, outputs=outputs)

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.15),
    metrics=['accuracy']
)

model.summary()

# ──────────────────────────────────────────────
# CALLBACKS
# ──────────────────────────────────────────────
callbacks = [
    tf.keras.callbacks.ModelCheckpoint(
        'best_model.keras',
        save_best_only=True,
        monitor='val_accuracy',
        verbose=1
    ),
    tf.keras.callbacks.EarlyStopping(
        patience=22,
        restore_best_weights=True,
        monitor='val_loss',
        verbose=1
    ),
    tf.keras.callbacks.ReduceLROnPlateau(
        patience=6,
        factor=0.5,
        min_lr=1e-6,
        monitor='val_loss',
        verbose=1
    ),
    tf.keras.callbacks.TensorBoard(log_dir='./logs')
]

# ──────────────────────────────────────────────
# TRAIN
# ──────────────────────────────────────────────
model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=120,
    batch_size=16,
    callbacks=callbacks,
    verbose=1
)

if X_test.shape[0] > 0:
    test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)
    print(f"\n[Test Results] Test Accuracy : {test_acc * 100:.2f}%")
    print(f"[Test Results] Test Loss     : {test_loss:.4f}")

with open('label_map.json', 'w') as f:
    json.dump(label_map, f, indent=2)

print("\n=== Training complete! Saved: best_model.keras ===")

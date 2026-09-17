# 🤟 AI Sign Language Translator Pro

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange?style=for-the-badge&logo=tensorflow)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)
![MediaPipe](https://img.shields.io/badge/MediaPipe-Holistic-00C853?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Real-time American Sign Language (ASL) detection and translation using AI + Computer Vision**

[🌐 Live Demo](https://ai-sign-language-translator-pro-2hxa.onrender.com/) · [📦 Report Bug](https://github.com/aryanhooda710-bit/ASL-Sign-Language-Project/issues)

</div>

---

## 🎯 What It Does

This application uses your **webcam** + **MediaPipe Holistic** to track hand, pose, and face landmarks in real-time, then feeds those landmarks into a **custom-trained LSTM/Transformer model** to recognize **100 ASL signs** and translate them into natural English sentences.

| Feature | Details |
|---------|---------|
| 🖐 Live Detection | Real-time webcam sign recognition via MediaPipe |
| 🧠 AI Model | Custom-trained deep learning model (100 ASL classes) |
| 📝 NLP Output | Grammatically correct English sentences |
| 🌍 Translation | Multi-language output support |
| 📸 Image Upload | Predict ASL from a static image |
| 🎥 Video Upload | Extract and predict signs from video files |
| 📄 Export | Download predictions as PDF or DOCX report |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   BROWSER (React + Vite)             │
│  ┌──────────────┐    ┌──────────────────────────┐   │
│  │  MediaPipe   │───▶│  Feature Extraction       │   │
│  │  Holistic    │    │  (pose + hands + face)    │   │
│  └──────────────┘    └────────────┬─────────────┘   │
│         ▲                         │ 205 features/frame│
│   Webcam Feed               WebSocket / HTTP         │
└─────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────▼──────────────┐
                    │      FastAPI Backend           │
                    │  ┌─────────────────────────┐  │
                    │  │  Normalize → Interpolate │  │
                    │  │  → TF Model (64×205)     │  │
                    │  │  → NLP Sentence Builder  │  │
                    │  └─────────────────────────┘  │
                    └──────────────────────────────┘
```

**Landmark pipeline:**
- **Pose**: 13 keypoints × 4 values = 52 features (shoulder-normalized)
- **Face**: 9 keypoints × 3 values = 27 features (nose-relative)
- **Left Hand**: 21 keypoints × 3 values = 63 features (wrist-relative)
- **Right Hand**: 21 keypoints × 3 values = 63 features (wrist-relative)
- **Total**: **205 features per frame**, **64 frames per sequence**

---

## 🚀 Quick Start (Local)

### Prerequisites
- Python 3.10+
- Node.js 18+
- A webcam

### 1. Clone the repo
```bash
git clone https://github.com/aryanhooda710-bit/ASL-Sign-Language-Project.git
cd ASL-Sign-Language-Project
```

### 2. Set up Python backend
```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r backend/requirements.txt
```

> ⚠️ **Model file**: The trained model (`best_model_runtime.keras`) is ~23MB and not included in the repo.  
> Download it from the [Releases](https://github.com/aryanhooda710-bit/ASL-Sign-Language-Project/releases) page and place it in the `backend/` folder.

### 3. Start the backend
```bash
cd backend
python main.py
# Backend runs on http://127.0.0.1:8000
```

### 4. Start the frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 5. Open in Chrome
```
http://localhost:5173
```
> ⚡ Use **Google Chrome** for best MediaPipe WebAssembly support.

---

## 🎮 How to Use

1. Open `http://localhost:5173` in Chrome
2. Click **"Start Detection"**
3. Allow camera access when prompted
4. Perform an ASL sign clearly in front of the camera
5. Hold the sign for ~1 second, then **lower your hands**
6. The AI predicts the word and builds a sentence!

### Supported Signs (100 classes)
`hello` · `thank you` · `please` · `yes` · `no` · `help` · `water` · `food` · `school` · `family` · `doctor` · `computer` · `work` · `eat` · `drink` · `go` · `stop` · `play` · `dance` · `music` · and 80 more...

---

## 🛠️ Tech Stack

### Backend
| Package | Purpose |
|---------|---------|
| FastAPI | REST API + WebSocket server |
| TensorFlow 2.x | Deep learning model inference |
| OpenCV | Video/image frame processing |
| MediaPipe | Server-side landmark extraction |
| Uvicorn | ASGI server |

### Frontend
| Package | Purpose |
|---------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool + dev server |
| MediaPipe Holistic (CDN) | Browser-side landmark extraction |
| Tailwind CSS 4 | Styling |
| Framer Motion | Animations |
| Chart.js / Recharts | Analytics visualization |

---

## 📁 Project Structure

```
ASL-Sign-Language-Project/
├── backend/
│   ├── main.py              # FastAPI app + WebSocket + model inference
│   ├── asl_nlp.py           # NLP sentence building + translation
│   ├── Gest_Landmark.py     # MediaPipe landmark extraction (server-side)
│   ├── sign_tips.py         # WLASL sign tips database
│   ├── label_map.json       # 100-class ASL label mapping
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── dashboard/
│   │   │       └── LiveDetectionCamera.jsx   # Main camera + AI component
│   │   ├── pages/           # Route pages (Landing, Dashboard, Analytics...)
│   │   ├── context/         # React context (Prediction, History, Theme)
│   │   ├── hooks/           # Custom hooks (useWebSocket, useWebcam)
│   │   └── services/        # API + WebSocket services
│   ├── index.html
│   └── vite.config.js       # Vite config with API proxy
└── README.md
```

---

## 🧠 Model Details

- **Architecture**: LSTM / Transformer-based sequence classifier
- **Input**: 64 frames × 205 landmark features
- **Output**: Softmax over 100 ASL classes
- **Training data**: WLASL (World Level American Sign Language) dataset
- **Accuracy**: Ensemble of original + mirrored prediction with entropy filtering

### Inference Pipeline
```
Raw frames → MediaPipe Holistic → 205 features/frame
→ Buffer 20–180 frames → Interpolate to 64 frames
→ Normalize (shoulder-width, wrist-relative)
→ TensorFlow model → Softmax (100 classes)
→ Confidence ≥ 50% + entropy check → Accepted prediction
→ NLP builder → English sentence
```

---

## 🌐 Deployment

The app is deployed on **Render**:
- **Live URL**: https://ai-sign-language-translator-pro-2hxa.onrender.com/
- Backend and frontend served from single FastAPI app (built React → `backend/static/`)
- `Dockerfile` included for container deployment

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Aryan Hooda**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/aryanhooda)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github)](https://github.com/aryanhooda710-bit)

---

<div align="center">
  <b>⭐ Star this repo if you found it helpful!</b>
</div>

# 🌍 Mission Control

> **Turning Crisis into Action.** Deploy resources faster, coordinate teams globally, and track real-time impact with an AI-powered logistics platform built for modern NGOs.

![Mission Control Dashboard](https://github.com/Programmer-NITIN/Mission-Control/assets/placeholder) <!-- Replace with a real screenshot later -->

**Mission Control** is a production-grade, hackathon-winning crowd management and crisis response platform. It leverages Google Cloud, Gemini AI, and Firebase to provide real-time coordination between field reports, volunteers, and critical resources during emergencies.

---

## ✨ Key Features

- **🤖 AI-Powered Report Processing:** Uses **Gemini 2.0 Flash** to instantly extract structured data (severity, location, people affected, urgency) from unstructured field reports.
- **🗺️ Live Interactive Maps:** Built with **Leaflet and OpenStreetMap** (100% free), visualizing critical needs and available volunteers in real-time.
- **⚡ Smart Volunteer Matching:** Multi-factor algorithm matching tasks to volunteers based on skills (35%), proximity (25%), availability (20%), rating (15%), and experience (5%).
- **🔥 Real-time Database & Auth:** Integrated with **Firebase** (Firestore & Auth) for instant data synchronization and secure Google Sign-In.
- **🎨 Premium UI/UX:** Built with Next.js, Tailwind CSS, and a custom glassmorphism design system for maximum accessibility and visual impact.
- **🛡️ Graceful Degradation:** Designed for reliable demos—automatically falls back to intelligent mock data if API limits are reached or keys are missing.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React, Tailwind CSS
- **Backend & State:** Zustand (Client State), Firebase Firestore (Real-time DB)
- **Authentication:** Firebase Auth (Google OAuth)
- **AI Integration:** Google Gemini API (via Vertex AI / AI Studio)
- **Mapping:** Leaflet + React-Leaflet + OpenStreetMap
- **Deployment:** Optimized for Google Cloud Run (Docker standalone mode)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v18+) installed.

### 1. Clone the repository

```bash
git clone https://github.com/Programmer-NITIN/Mission-Control.git
cd Mission-Control
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory. You will need API keys for Firebase and Gemini.

```env
# ─── Firebase Configuration ─────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# ─── Google Gemini API ──────────────────────────────────────
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🏗️ Deployment (Cloud Run Ready)

This project is configured with a multi-stage `Dockerfile` optimized for Next.js `standalone` output mode, making it incredibly lightweight and fast for deployment on Google Cloud Run.

```bash
# Build the Docker image
docker build -t mission-control .

# Run locally via Docker
docker run -p 3000:3000 mission-control
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you'd like to improve the platform.

## 📄 License

This project is licensed under the MIT License.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Firebase-Firestore%20%2B%20Auth-FFCA28?style=for-the-badge&logo=firebase" />
  <img src="https://img.shields.io/badge/Gemini-2.0%20Flash-4285F4?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/Cloud%20Run-Deployed-4285F4?style=for-the-badge&logo=googlecloud" />
  <img src="https://img.shields.io/badge/Leaflet-OpenStreetMap-199900?style=for-the-badge&logo=leaflet" />
</p>

# 🌍 Mission Control

> **AI-Powered Crisis Response & Volunteer Coordination Platform**
>
> Deploy resources faster. Coordinate teams globally. Save lives with intelligent automation.

**Mission Control** is a production-grade logistics platform purpose-built for NGOs, disaster response teams, and humanitarian organizations. It leverages **Google Gemini AI** to transform unstructured field reports into actionable intelligence, matches volunteers to tasks using a multi-factor algorithm, and visualizes operations on a real-time interactive map — all deployed on **Google Cloud Run**.

🔗 **Live Demo:** [mission-control-69450979027.us-central1.run.app](https://mission-control-69450979027.us-central1.run.app)

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Google Cloud Integration](#-google-cloud-integration)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔴 Problem Statement

During natural disasters and humanitarian crises, relief organizations face critical coordination failures:

| Challenge | Impact |
|---|---|
| **Unstructured Data** | Field reports arrive as chaotic text messages, making triage impossible |
| **Manual Matching** | Coordinators spend hours manually matching volunteers to tasks |
| **No Spatial Awareness** | Teams lack real-time visibility of where resources are needed vs. available |
| **Siloed Systems** | Volunteer databases, task boards, and maps exist in separate tools |

These inefficiencies cost **hours** during the critical "golden window" of disaster response, directly impacting lives saved.

---

## ✅ Solution

Mission Control solves this with a unified, AI-driven command center:

```
┌─────────────────────────────────────────────────────────────┐
│                    MISSION CONTROL                          │
│                                                             │
│  📝 Raw Report ──→ 🤖 Gemini AI ──→ 📊 Structured Task     │
│                                          │                  │
│                                          ▼                  │
│  👥 Volunteer DB ──→ 🧮 Matching ──→ ✅ Auto-Assignment     │
│                       Algorithm                             │
│                                          │                  │
│                                          ▼                  │
│  🗺️ Live Map ←────── Real-time Sync ←── Firebase            │
└─────────────────────────────────────────────────────────────┘
```

1. **Ingest** — A relief worker submits a raw, unstructured field report
2. **Process** — Gemini 2.0 Flash extracts severity, location, affected count, and category
3. **Match** — The matching algorithm scores all available volunteers in real-time
4. **Deploy** — The best-matched volunteer is assigned and visible on the live map

---

## ✨ Key Features

### 🤖 AI-Powered Report Processing (Gemini 2.0 Flash)
Transform chaotic field reports into structured, actionable data. Gemini extracts:
- **Title & Description** — Auto-generated summary
- **Category** — disaster, health, food, shelter, logistics, education
- **Severity Score** — 1-10 scale based on context analysis
- **People Affected** — Estimated count from natural language
- **Location** — Geographic extraction from text
- **Urgency Level** — Time-sensitive prioritization

### 🗺️ Real-Time Interactive Map (Leaflet + OpenStreetMap)
- Zero-cost mapping with no API keys required
- Pulsing red markers for critical needs (severity ≥ 8)
- Green markers for available volunteers
- Click-to-assign workflow directly from map view
- Auto-fit bounds to show all active operations

### ⚡ Smart Volunteer Matching Algorithm
Multi-factor scoring system with configurable weights:

| Factor | Weight | Description |
|---|---|---|
| **Skill Match** | 35% | Fuzzy matching of required vs. volunteer skills |
| **Proximity** | 25% | Haversine distance calculation with decay curve |
| **Availability** | 20% | Real-time status (available, busy, offline) |
| **Rating** | 15% | Historical performance score (0-5) |
| **Experience** | 5% | Normalized completed task count |

### 🔐 Firebase Authentication (Google OAuth)
- One-click Google Sign-In with popup flow
- Secure session management via `onAuthStateChanged`
- Graceful error handling for unauthorized domains
- Demo mode fallback when Firebase is unconfigured

### 📊 Real-Time Dashboard
- Live statistics: Active Needs, Volunteers Online, Tasks Resolved
- Urgent Response Queue with severity-based sorting
- Category distribution breakdown
- Animated cards with staggered entrance effects

### 🛡️ Graceful Degradation System
Every external service has a built-in fallback:
- **Gemini AI** → Intelligent mock parser if API key is missing or rate-limited (429)
- **Firebase** → Local mock data store if credentials are unavailable
- **Maps** → OpenStreetMap (always free, no key needed)

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                            │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │  Next.js App │  │  Zustand     │  │  React Components       │ │
│  │  Router      │  │  Global Store│  │  (Navbar, Map, Cards)   │ │
│  └──────┬───────┘  └──────┬───────┘  └────────────┬────────────┘ │
│         │                 │                       │              │
│         └────────────┬────┴───────────────────────┘              │
│                      │                                           │
└──────────────────────┼───────────────────────────────────────────┘
                       │ HTTPS
┌──────────────────────┼───────────────────────────────────────────┐
│                GOOGLE CLOUD PLATFORM                             │
│                      │                                           │
│  ┌───────────────────▼──────────────────────┐                    │
│  │           Google Cloud Run               │                    │
│  │    (Docker Container / Next.js SSR)      │                    │
│  └───────┬──────────────────┬───────────────┘                    │
│          │                  │                                    │
│  ┌───────▼──────┐   ┌──────▼──────────────┐                     │
│  │  Firebase    │   │  Gemini 2.0 Flash   │                     │
│  │  ┌────────┐  │   │  (AI Studio API)    │                     │
│  │  │Firestore│  │   └─────────────────────┘                     │
│  │  │(NoSQL)  │  │                                               │
│  │  └────────┘  │   ┌─────────────────────┐                     │
│  │  ┌────────┐  │   │  Leaflet +          │                     │
│  │  │  Auth  │  │   │  OpenStreetMap      │                     │
│  │  │(OAuth) │  │   │  (Free Map Tiles)   │                     │
│  │  └────────┘  │   └─────────────────────┘                     │
│  └──────────────┘                                                │
└──────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input (Raw Text)
    │
    ▼
Gemini 2.0 Flash API ──→ Structured JSON
    │                     {title, severity, location, category, ...}
    ▼
Zustand Store ──→ Optimistic UI Update
    │
    ▼
Firestore (Cloud) ──→ Real-time Sync to all clients
    │
    ▼
Matching Algorithm ──→ Ranked volunteer suggestions
    │
    ▼
Assignment ──→ Task status update + Map marker change
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | SSR, routing, file-based pages |
| **Language** | TypeScript | Type safety across the full stack |
| **Styling** | Tailwind CSS + Custom Design System | Glassmorphism UI with design tokens |
| **State** | Zustand | Lightweight global state management |
| **Database** | Firebase Firestore | Real-time NoSQL with `onSnapshot` listeners |
| **Auth** | Firebase Auth | Google OAuth 2.0 popup flow |
| **AI** | Google Gemini 2.0 Flash | Natural language → structured data |
| **Maps** | Leaflet + OpenStreetMap | Free interactive mapping (zero API cost) |
| **Deployment** | Google Cloud Run | Serverless containerized deployment |
| **Container** | Docker (multi-stage) | Optimized production builds |

---

## 📁 Project Structure

```
mission-control/
├── src/
│   ├── app/                          # Next.js App Router (Pages & Layouts)
│   │   ├── layout.tsx                # Root layout with AuthProvider
│   │   ├── page.tsx                  # Landing page
│   │   ├── globals.css               # Design system & Tailwind config
│   │   ├── dashboard/                # Real-time statistics & task queue
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── map/                      # Interactive Leaflet map view
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── reports/                  # AI-powered report submission
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── volunteers/               # Volunteer management (CRUD)
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── assignments/              # Smart matching & task assignment
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   └── analytics/                # Operational analytics dashboard
│   │       ├── page.tsx
│   │       └── layout.tsx
│   │
│   ├── backend/                      # Server-Side Logic & Services
│   │   ├── config/
│   │   │   └── firebase.ts           # Firebase app initialization
│   │   ├── services/
│   │   │   ├── firestore.ts          # Firestore CRUD + real-time subscriptions
│   │   │   ├── gemini.ts             # Gemini AI integration + fallback system
│   │   │   └── matching-algorithm.ts # Multi-factor volunteer scoring engine
│   │   └── data/
│   │       └── mock-data.ts          # Type definitions & seed data
│   │
│   └── frontend/                     # Client-Side UI Layer
│       ├── components/
│       │   ├── layout/
│       │   │   └── Navbar.tsx         # Global navigation + auth status
│       │   ├── ui/
│       │   │   ├── StatCard.tsx       # Animated statistic display card
│       │   │   └── TaskCard.tsx       # Severity-aware task card
│       │   └── maps/
│       │       └── MissionMap.tsx     # Leaflet map with custom markers
│       ├── context/
│       │   └── AuthContext.tsx        # Firebase Auth provider + Google OAuth
│       └── store/
│           └── app-store.ts          # Zustand global state + Firestore sync
│
├── public/                           # Static assets
├── Dockerfile                        # Multi-stage production build
├── .env.local                        # Environment variables (not committed)
├── .gcloudignore                     # Cloud Run deployment exclusions
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** v9+ (comes with Node.js)
- A **Firebase project** ([create one](https://console.firebase.google.com/))
- A **Gemini API key** ([get one](https://aistudio.google.com/apikey))

### 1. Clone the Repository

```bash
git clone https://github.com/Programmer-NITIN/Mission-Control.git
cd Mission-Control
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env.local` file in the project root:

```env
# ─── Firebase Configuration ─────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# ─── Google Gemini AI ───────────────────────────────────────
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# ─── Maps (Free — No Key Required) ──────────────────────────
NEXT_PUBLIC_MAP_PROVIDER=leaflet
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Authentication** → Sign-in method → **Google**
4. Enable **Cloud Firestore** → Create database (Start in test mode)
5. Go to **Project Settings** → Copy your web app config
6. Add your deployment domain to **Authentication** → **Settings** → **Authorized domains**

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase project API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Yes | Google AI Studio API key |
| `NEXT_PUBLIC_MAP_PROVIDER` | No | Map provider (default: `leaflet`) |

> **Note:** The app runs in **demo mode** without these keys, using intelligent mock data for all services.

---

## 🐳 Deployment

### Google Cloud Run (Recommended)

This project includes an optimized multi-stage `Dockerfile` for Cloud Run:

```bash
# Option 1: Deploy directly from source
gcloud run deploy mission-control \
  --source . \
  --region us-central1 \
  --allow-unauthenticated

# Option 2: Build and run locally with Docker
docker build -t mission-control .
docker run -p 3000:3000 mission-control
```

### Post-Deployment Checklist

- [ ] Add your Cloud Run URL to Firebase → Auth → **Authorized Domains**
- [ ] Set environment variables in Cloud Run → **Edit & Deploy** → **Variables**
- [ ] Enable Firestore security rules for production

---

## ☁️ Google Cloud Integration

Mission Control is deeply integrated with Google Cloud services:

| Service | Usage | Free Tier |
|---|---|---|
| **Cloud Run** | Containerized app hosting | 2M requests/month |
| **Firebase Auth** | Google OAuth sign-in | Unlimited (Spark plan) |
| **Firestore** | Real-time NoSQL database | 1 GiB storage, 50K reads/day |
| **Gemini API** | AI report processing | 15 RPM (AI Studio free tier) |
| **Artifact Registry** | Docker image storage | 500 MB |

---

## 📡 API Documentation

### Gemini AI Processing

```typescript
// Input: Raw unstructured text
const result = await processReportWithAI(
  "Severe flooding in Ernakulam. 450 people stranded on rooftops."
);

// Output: Structured JSON
{
  title: "Severe Flooding Emergency - Ernakulam District",
  description: "Major flooding event with residential areas submerged...",
  category: "disaster",
  severity: 9,
  urgency: 10,
  peopleAffected: 450,
  location: "Ernakulam District, Kerala"
}
```

### Matching Algorithm

```typescript
// Input: Task + Volunteer pool
const matches = matchVolunteers(task, volunteers, topN: 3);

// Output: Ranked results with scoring breakdown
[
  {
    volunteer: { name: "Sarah J.", skills: ["First Aid", "Driving"] },
    score: 87,
    breakdown: {
      skillMatch: 100,    // 35% weight
      proximity: 92,      // 25% weight
      availability: 100,  // 20% weight
      rating: 90,         // 15% weight
      experience: 45      // 5% weight
    },
    reasoning: "Matches prioritized based on 2.3 km proximity..."
  }
]
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing TypeScript conventions
- Ensure `npm run build` passes with zero errors
- Test with both live Firebase keys and demo mode (no keys)
- Keep the graceful degradation pattern for any new external service

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ for the <strong>Google Solution Challenge 2026</strong>
  <br />
  <a href="https://mission-control-69450979027.us-central1.run.app">Live Demo</a> · <a href="https://github.com/Programmer-NITIN/Mission-Control/issues">Report Bug</a> · <a href="https://github.com/Programmer-NITIN/Mission-Control/issues">Request Feature</a>
</p>

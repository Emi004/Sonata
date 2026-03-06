# 🎵 Sonata | Music Streaming Platform

Sonata is a modern, high-performance music streaming web application built with a **FastAPI** backend and a **React/Vite** frontend. It features a sleek "Midnight Electric" UI, dynamic playback controls, and personalized music discovery.

---

## 🛠️ Tech Stack & Requirements

### Frontend
* **Framework:** React 18+ (via Vite)
* **Styling:** Tailwind CSS v4 + daisyUI (Custom "Sonata" Theme)
* **State Management:** React Context API (Global Audio State)
* **Icons:** Lucide React
* **Drag & Drop:** `@hello-pangea/dnd` (Optimized fork of `react-beautiful-dnd`)

### Backend
* **Framework:** FastAPI (Python 3.10+)
* **Server:** Uvicorn with `--reload`
* **Database:** PostgreSQL (via SQLAlchemy ORM)
* **Security:** JWT (JSON Web Tokens) for Authentication
* **Validation:** Pydantic v2

### System Requirements
* **Node.js:** v18.0.0 or higher
* **Python:** 3.10 or higher
* **Database:** Local PostgreSQL instance or Supabase

---

## 🚀 Key Dynamic Features

### 1. Interactive Media Engine
A persistent, global music player that remains active while navigating the app.
* **Live Controls:** Play/Pause, Skip Forward/Backward, and a reactive Seek Bar.
* **Audio Intelligence:** Real-time volume slider and "Mute" toggle.
* **Favorites:** One-click "Heart" button that syncs with the user's library in real-time via the backend API.

### 2. Intelligent Search & Recommendations
A high-speed search bar designed for discovery.
* **Instant Results:** Debounced search queries that fetch songs and artists as the user types.
* **Contextual Suggestions:** Displays "Recommended Searches" based on trending tracks or recent history before the user finishes typing.

### 3. Smart Playlist Manager (Drag & Drop)
A desktop-class experience for organizing music.
* **Custom Curation:** Create, name, and delete personal playlists.
* **Reorder Logic:** Intuitive Drag & Drop functionality to reorder tracks within a playlist.
* **Persistent Ordering:** Frontend syncs new index orders to the Python backend to ensure the custom sequence is saved to the database.

### 4. Personalized Discovery Home
A data-driven landing page that feels unique to every user.
* **Genre Explorer:** Dynamic grid showing music categories (Jazz, Lo-fi, Synthwave, etc.).
* **Recommendation Engine:** A "Picked for You" section based on the user's most-played genres.

---

## 📂 Project Structure

```text
Sonata/
├── backend/            # FastAPI Python Logic
│   ├── src/
│   │   ├── models/     # DB Schemas (SQLAlchemy)
│   │   ├── schemas/    # Pydantic Validation
│   │   ├── routers/    # API Endpoints
│   │   ├── services/   # Business Logic
│   │   └── main.py     # Entry Point
├── frontend/           # React + Tailwind UI
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/      # useAudio player logic
│   │   ├── context/    # Global Audio Context
│   │   └── App.jsx     # Main Layout
└── README.md

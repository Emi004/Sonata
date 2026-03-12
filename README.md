# 🎵 Sonata | Music Streaming & Artist Platform

**Sonata** is a high-performance music streaming ecosystem designed for seamless audio delivery and artist empowerment. Developed as a full-stack educational project, it demonstrates proficiency in **asynchronous backend architecture**, **event-driven database design**, and **global state management**.

---

## 🛠️ Tech Stack & System Requirements

### **Frontend (The User Interface)**
* **Framework:** **React 18** (Vite) for optimized performance and rapid development.
* **Styling:** **Tailwind CSS + daisyUI** ("Midnight Electric" theme) for a responsive, modern aesthetic.
* **State Management:** **React Context API**, creating a global provider for the persistent Audio Engine.
* **Client Communication:** **Supabase JS SDK** for real-time authentication and database interaction.

### **Backend (The Logic Layer)**
* **Framework:** **FastAPI (Python 3.13+)**, utilizing asynchronous programming for high-concurrency performance.
* **Security:** **JWT (JSON Web Tokens)** verification using `python-jose` to protect sensitive routes.
* **Validation:** **Pydantic v2** for strict data schema enforcement and serialization.
* **Server:** **Uvicorn** ASGI server for local development and production-ready hosting.

### **Database & Infrastructure (The Data Layer)**
* **Database:** **PostgreSQL** (via **Supabase**) for robust relational data management.
* **Automation:** **PL/pgSQL Triggers** to automatically synchronize Auth identities with Public User profiles.
* **Media Storage:** **Supabase Storage (S3)** for high-fidelity audio binaries and image assets.

---

## 🚀 Key Dynamic Features

### 1. Interactive Media Engine
A persistent, global music player that remains active during site-wide navigation.
* **Live Controls:** Play/Pause, Skip, and a reactive Seek Bar utilizing the HTML5 Audio API.
* **Audio Intelligence:** Real-time volume management and state-aware "Mute" toggles.
* **Favorites Sync:** A "Heart" button that performs real-time RESTful updates to the backend library.

### 2. Intelligent Search & Recommendations
A high-speed discovery interface optimized for low latency.
* **Instant Results:** Debounced search queries that fetch songs and artists as the user types.
* **Contextual Suggestions:** Pre-fetch logic that displays trending tracks or recent history before the user submits a search.

### 3. Smart Playlist Manager (Drag & Drop)
A desktop-class experience for organizing music using a **Many-to-Many** relational structure.
* **Custom Curation:** Full CRUD functionality for creating and managing personal playlists.
* **Reorder Logic:** Integrated Drag & Drop functionality that updates the local UI state instantly.
* **Persistent Ordering:** Frontend syncs new index sequences to the Python backend to preserve custom track orders in PostgreSQL.

### 4. Personalized Discovery Home
A data-driven landing page that personalizes the experience for every user.
* **Genre Explorer:** A dynamic grid mapped from database genre array types (`text[]`).
* **Recommendation Engine:** Filtering logic that suggests tracks based on the user's most frequently played genres.

### 5. Artist Portal & Music Distribution
Empowering creators to share their work through professional tools.
* **Artist Onboarding:** An application flow that updates user metadata to grant "Artist Status."
* **Media Pipeline:** A robust dashboard handling **Multipart/Form-Data** for secure file transfers to cloud storage.
* **Content Management:** Full metadata control for artists to manage titles, genres, and track availability.

---

## 👥 User Roles

| Role | Permissions |
| :--- | :--- |
| **Listener** | Stream audio, create/reorder playlists, and favorite tracks. |
| **Artist** | Upload media, manage albums/track metadata, and edit artist profile. |
| **Admin** | Manage user status, moderate content, and oversee platform health. |

---

## 📂 Project Structure Overview

```text
Sonata/
├── backend/                # FastAPI Logic
│   ├── src/
│   │   ├── clients/        # Supabase Client & Lifecycle
│   │   ├── models/         # Pydantic Schemas (Read/Create)
│   │   ├── routers/        # API Endpoints (Auth, Music, Playlists)
│   │   ├── services/       # JWT Logic & Database Triggers
│   │   └── main.py         # Entry Point & Lifespan
├── frontend/               # React UI
│   ├── src/
│   │   ├── components/     # Media Player, Search, Playlists
│   │   ├── context/        # Global Audio State Management
│   │   ├── hooks/          # Custom Supabase & Fetch Hooks
│   │   └── App.jsx         # Routing & Page Layouts
└── README.md               # Documentation
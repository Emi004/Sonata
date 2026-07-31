# 🎵 Sonata

> A full-stack music streaming and artist platform — built with **React 19**, **FastAPI**, and **Supabase**.

**Live demo:** [emi004.github.io/Sonata](https://emi004.github.io/Sonata)

---

## ✨ Features

- 🎧 **Persistent Media Player** — Global audio engine with play/pause, seek, volume, and mute controls using the HTML5 Audio API
- 🔍 **Instant Search** — Debounced, real-time track and artist search with trending pre-fetch suggestions
- 📂 **Playlist Manager** — Full CRUD playlists with drag-and-drop reordering synced to the backend
- 🏠 **Personalized Home Feed** — Genre-based recommendation engine driven by listening history
- 🎤 **Artist Portal** — Multipart file upload pipeline for tracks and albums, with full metadata management
- 🔐 **Auth & Role System** — Supabase Auth with JWT verification protecting role-scoped routes (Listener / Artist / Admin)

---

## 🛠️ Tech Stack

### Frontend
| Layer | Technology |
| :--- | :--- |
| Framework | React 19 (Vite 7) |
| Styling | Tailwind CSS v4 + daisyUI v5 |
| Routing | React Router DOM v7 |
| State | React Context API (`AudioContext`, `AuthContext`, `TrackContext`) |
| Auth / DB | Supabase JS SDK v2 |
| Deploy | GitHub Pages (`gh-pages`) |

### Backend
| Layer | Technology |
| :--- | :--- |
| Framework | FastAPI 0.120 |
| Runtime | Python 3.12 / Uvicorn |
| Auth | Supabase Auth + JWT via `dependencies.py` |
| Validation | Pydantic v2 models |
| Storage | Supabase Storage (S3) for audio & images |
| Container | Docker (exposes port `8080`) |

### Database
- **PostgreSQL** via Supabase — relational schema for users, tracks, albums, and playlists
- **PL/pgSQL Triggers** — auto-sync Auth identities → public user profiles
- **`text[]` genre columns** — powering the genre explorer grid

---

## 📂 Project Structure

```text
Sonata/
├── backend/
│   ├── Dockerfile
│   ├── scripts/
│   └── src/
│       ├── main.py                  # FastAPI app entry point, CORS, router registration
│       ├── requirements.txt
│       ├── clients/                 # Supabase client & lifecycle management
│       ├── models/                  # Pydantic schemas
│       │   ├── Album.py
│       │   ├── Login.py
│       │   ├── Playlist.py
│       │   ├── Track.py
│       │   └── User.py
│       ├── routers/                 # API route handlers
│       │   ├── album.py             # GET /albums
│       │   ├── auth.py              # POST /auth (internal)
│       │   ├── health.py            # GET /health
│       │   ├── track.py             # GET/POST /tracks
│       │   └── user.py              # GET/PATCH /users
│       ├── schemas/                 # DB-level schema helpers
│       ├── services/                # Business logic
│       │   ├── Album.py
│       │   ├── Login.py
│       │   ├── Track.py
│       │   ├── User.py
│       │   ├── dependencies.py      # JWT auth dependency injection
│       │   └── lifespan.py          # App startup/shutdown hooks
│       └── test/
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx                  # Root layout & page composition
        ├── routers.jsx              # Client-side route definitions
        ├── main.jsx                 # React DOM entry point
        ├── clients/                 # Supabase JS client singleton
        ├── context/
        │   ├── AudioContext.jsx     # Global audio engine state
        │   ├── AuthContext.jsx      # Auth session & user role state
        │   └── TrackContext.jsx     # Track list, search, playback queue
        ├── components/
        │   ├── MediaPlayer.jsx      # Persistent bottom player bar
        │   ├── Sidebar.jsx          # Navigation + playlist panel
        │   ├── SongCard.jsx         # Reusable track tile
        │   ├── artist/
        │   │   ├── AlbumCreateForm.jsx
        │   │   ├── TrackUploadForm.jsx       # Multipart audio upload
        │   │   ├── TrackPreviewCard.jsx
        │   │   ├── UnpublishedAlbumsList.jsx
        │   │   └── UnpublishedTracksList.jsx
        │   ├── modals/              # Dialog overlays
        │   ├── navbar/              # Top navigation bar
        │   └── profile/             # Profile display components
        └── pages/
            ├── Artist.jsx           # Artist dashboard & content management
            └── Profile.jsx          # Listener profile & history
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18 and npm
- Python 3.12+
- A [Supabase](https://supabase.com) project (PostgreSQL + Auth + Storage)

### Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv && source .venv/bin/activate

# Install dependencies
pip install -r src/requirements.txt

# Set environment variables
cp .env.example .env  # Fill in SUPABASE_URL, SUPABASE_SERVICE_KEY, etc.

# Run the dev server
uvicorn src.main:app --reload --port 8080
```

Or with Docker:

```bash
cd backend
docker build -t sonata-api .
docker run -p 8080:8080 --env-file .env sonata-api
```

API docs available at `http://localhost:8080/docs`.

### Frontend

```bash
cd frontend

npm install

# Set environment variables
cp .env.example .env  # Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL

npm run dev
```

App runs at `http://localhost:5173`.

---

## 👥 User Roles

| Role | Capabilities |
| :--- | :--- |
| **Listener** | Stream audio, manage playlists, favorite tracks |
| **Artist** | Upload & manage tracks/albums, edit artist profile |
| **Admin** | Moderate content, manage user status, platform health |

---

## 🔌 API Endpoints

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service health check |
| `GET` | `/users/{id}` | Get user profile |
| `PATCH` | `/users/{id}` | Update user metadata / grant artist status |
| `GET` | `/tracks` | List/search tracks |
| `POST` | `/tracks` | Upload a new track (Artist only) |
| `GET` | `/albums` | List albums |
| `POST` | `/albums` | Create a new album (Artist only) |

Full interactive docs: `<backend-url>/docs`

---

## 🌐 Deployment

- **Frontend** is deployed to **GitHub Pages** via `npm run deploy` (`gh-pages` package).
- **Backend** is containerized with Docker and can be deployed to any container hosting platform (Railway, Fly.io, Render, etc.).
- CORS is pre-configured for `https://emi004.github.io`.

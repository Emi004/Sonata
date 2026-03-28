from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from services.lifespan import lifespan
from routers.health import health
from routers.user import user
from routers.auth import auth
from routers.track import tracks
from routers.album import albums

app=FastAPI(title='sonata-api',
      description='This document describes the current operations available on the Sonata music streaming web application',
      lifespan=lifespan,
      version='v1')

origins = [
  "http://localhost:5173",
  "https://emi004.github.io",
  "https://Emi004.github.io",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(health,prefix="/health",tags=['health'])
app.include_router(user,prefix="/users",tags=['users'])
app.include_router(auth, prefix="/auth", include_in_schema=False)
app.include_router(tracks, prefix="/tracks", tags=['tracks'])
app.include_router(albums, prefix="/albums", tags=['albums'])

@app.get("/",include_in_schema=False)
async def root():
    return {"message": "Welcome to Sonata Streaming API for swagger go to /docs"}

if __name__ == '__main__':
  uvicorn.run(app, host="0.0.0.0", port=8080)
from fastapi import FastAPI
import uvicorn

from services.lifespan import lifespan
from routers.health import health
from routers.user import user
from routers.auth import auth

app=FastAPI(title='sonata-api',
            description='This document describes the current operations available on the Sonata music streaming web application',
            lifespan=lifespan,
            version='v1')

app.include_router(health,prefix="/health",tags=['health'])
app.include_router(user,prefix="/users",tags=['users'])
app.include_router(auth, prefix="/auth", include_in_schema=False)

@app.get("/",include_in_schema=False)
async def root():
    return {"message": "Welcome to Sonata Streaming API for swagger go to /docs"}

if __name__ == '__main__':
  uvicorn.run(app, host="0.0.0.0", port=8080)
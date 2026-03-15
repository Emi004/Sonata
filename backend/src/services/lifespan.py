from clients.Supabase import supabase_client
from fastapi import FastAPI
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.supabase_client = supabase_client

    yield



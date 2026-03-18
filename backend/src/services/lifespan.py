from contextlib import asynccontextmanager

from fastapi import FastAPI

from clients.Supabase import create_supabase_client, create_supabase_admin_client


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.supabase_client = await create_supabase_client()
    app.state.supabase_admin_client = await create_supabase_admin_client()

    yield

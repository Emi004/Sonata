import os
from dotenv import load_dotenv
from supabase import acreate_client, AsyncClient

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_ANON_KEY")
god_key: str = os.environ.get("SUPABASE_SERVICE_KEY")


async def create_supabase_client() -> AsyncClient:
    supabase= await acreate_client(url, key)
    return supabase

async def create_supabase_admin_client() -> AsyncClient:
    supabase= await acreate_client(url, god_key)
    return supabase

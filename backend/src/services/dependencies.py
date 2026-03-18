from fastapi import Request, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from supabase import AsyncClient as SupabaseClient

from models.User import User
from services.User import get_user_by_id


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_supabase_client(request: Request) -> SupabaseClient:
    return request.app.state.supabase_client

def get_supabase_admin_client(request: Request) -> SupabaseClient:
    return request.app.state.supabase_admin_client


async def get_current_user(token: str = Depends(oauth2_scheme), supabase_client: SupabaseClient = Depends(get_supabase_client)) -> User:
    user = await supabase_client.auth.get_user(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    user_id = user.user.id
    return await get_user_by_id(supabase_client, user_id)
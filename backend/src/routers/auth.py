from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from models.Login import LoginRequest, LoginResponse
from services.Login import login_service
from services.dependencies import get_supabase_client

auth = APIRouter()

@auth.post(
    "/login",
    status_code=200,
    summary="Log in a user.",
    description="Authenticate a user and return an access token",
    response_description="An access token for the authenticated user",
)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), supabase_client=Depends(get_supabase_client)) -> LoginResponse:
    request = LoginRequest(email=form_data.username, password=form_data.password)
    response = await login_service(request, supabase_client)
    if not response:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return response
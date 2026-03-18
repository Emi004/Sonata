from models.Login import LoginRequest, LoginResponse
from supabase import AsyncClient as SupabaseClient

async def login_service(request: LoginRequest, supabase_client: SupabaseClient) -> LoginResponse:
    response = await supabase_client.auth.sign_in_with_password(
        {
            "email": request.email,
            "password": request.password,
        }
    )

    if not response.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return LoginResponse(
        access_token=response.session.access_token,
        token_type="bearer",
    )
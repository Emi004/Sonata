from fastapi import APIRouter, Depends, HTTPException, status

from models.User import User, UserUpdate, UserUpdateAdmin
from services.User import get_users, get_user_by_id, update_user_by_id, delete_user_by_id
from services.dependencies import get_supabase_client,get_supabase_admin_client, get_current_user

user = APIRouter()


@user.get("",
    status_code=200,
    summary="Get all users.",
    description="Retrieve a list of all users in the system",
    response_description="A list of users",
    response_model=list[User],
)
async def list_users(supabase_client=Depends(get_supabase_admin_client), current_user=Depends(get_current_user)) -> list[User]:
    if current_user.is_admin:
        get_users_response = await get_users(supabase_client)
        return get_users_response
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource",
        )
       

@user.get(
    "/me",
    status_code=200,
    summary="Get the current user.",
    description="Retrieve the currently authenticated user's information",
    response_description="The current user object",
    response_model=User,
)
async def get_me(current_user=Depends(get_current_user)) -> User:
    return current_user


@user.get(
    "/{user_id}",
    status_code=200,
    summary="Get a user by ID.",
    description="Retrieve a user by their unique ID",
    response_description="A user object",
    response_model=User,
)
async def get_user(user_id: str, supabase_client=Depends(get_supabase_admin_client), current_user=Depends(get_current_user)) -> User:
    if current_user.is_admin:
        user = await get_user_by_id(supabase_client, user_id)
        return user
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource",
        )

@user.patch(
    "/me",
    status_code=200,
    summary="Update the current user.",
    description="Update the currently authenticated user's information",
    response_description="The updated user object",
    response_model=User)
async def update_user(user_update: UserUpdate, current_user=Depends(get_current_user), supabase_client=Depends(get_supabase_client)) -> User:
    updated_user = await update_user_by_id(supabase_client, str(current_user.id), user_update)
    return updated_user

@user.patch(
    "/{user_id}",
    status_code=200,
    summary="Update a user by ID.",
    description="Update a user's information by their unique ID",
    response_description="The updated user object",
    response_model=User)
async def update_user_admin(user_id: str, user_update: UserUpdateAdmin, current_user=Depends(get_current_user), supabase_client=Depends(get_supabase_admin_client)) -> User:
    if current_user.is_admin:
        updated_user = await update_user_by_id(supabase_client, user_id, user_update)
        return updated_user
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource",
        )

@user.delete(
    "/me",
    status_code=204,
    summary="Delete the current user.",
    description="Delete the currently authenticated user's account",
    response_description="No content")
async def delete_me(current_user=Depends(get_current_user), supabase_client=Depends(get_supabase_admin_client)):
    await delete_user_by_id(supabase_client, str(current_user.id))
    return

@user.delete(
    "/{user_id}",
    status_code=204,
    summary="Delete a user by ID.",
    description="Delete a user from the system by their unique ID",
    response_description="No content")
async def delete_user(user_id: str, current_user=Depends(get_current_user), supabase_client=Depends(get_supabase_admin_client)):
    if current_user.is_admin:
        await delete_user_by_id(supabase_client, user_id)
        return
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource",
        )

# creating a user is handled by the supabase auth system, so we don't need to implement it here
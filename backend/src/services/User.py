from supabase import AsyncClient as SupabaseClient
from models.User import User, UserUpdate, UserUpdateAdmin
from fastapi import HTTPException, status  

async def get_users(supabase: SupabaseClient)->list[User]:
    try:
        users = await supabase.table('User').select('*').execute()
        return [User(**user) for user in users.data]
    except Exception as e:
        print(f"DEBUG GET USERS ERROR: {type(e).__name__} - {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No users found",
        )

async def get_user_by_id(supabase: SupabaseClient, user_id: str)->User:
    try:
        user = await supabase.table('User').select('*').eq('id', user_id).single().execute()
        return User(**user.data)
    except Exception as e:
        print(f"DEBUG GET USER ERROR: {type(e).__name__} - {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found",
        )

async def update_user_by_id(supabase: SupabaseClient, user_id: str, user_update: UserUpdate|UserUpdateAdmin)->User:
    update_data = user_update.model_dump(exclude_unset=True)
    try:
        updated_user = await supabase.table('User').update(update_data).eq('id', user_id).execute()
        return User(**updated_user.data[0])
    except Exception as e:
        print(f"DEBUG UPDATE ERROR: {type(e).__name__} - {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found",
        )

async def delete_user_by_id(supabase: SupabaseClient, user_id: str)->None:  
    
    try:
        await supabase.auth.admin.delete_user(user_id)
    except Exception as e:
        print(f"DEBUG DELETE ERROR: {type(e).__name__} - {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found",
        )


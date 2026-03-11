from fastapi import Request

def get_supabase_client(request: Request):
    return request.app.state.supabase_client
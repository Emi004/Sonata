from supabase import AsyncClient as SupabaseClient
from models.Track import TrackCreateRequest, TrackResponse
from fastapi import HTTPException, status, Depends
from models.Track import TrackCreateRequest, TrackResponse

async def add_track(track_data: TrackCreateRequest, supabase_client: SupabaseClient) -> TrackResponse:
    try:
        response = await supabase_client.from_('Track').insert(track_data.model_dump(mode="json")).execute()
        return TrackResponse(**response.data[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add track: {str(e)}")

async def get_all_tracks(supabase_client: SupabaseClient) -> list[TrackResponse]:
    try:
        response = await supabase_client.from_('Track').select('*').execute()
        return [TrackResponse(**track) for track in response.data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve tracks: {str(e)}")

async def get_all_tracks_by_name(name: str, supabase_client: SupabaseClient) -> list[TrackResponse]:
    try:
        response = await supabase_client.from_('Track').select('*').ilike('title', f'%{name}%').execute()
        return [TrackResponse(**track) for track in response.data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve tracks: {str(e)}")
from supabase import AsyncClient as SupabaseClient
from fastapi import HTTPException, status, Depends

from models.Track import TrackCreateRequest, TrackResponse, DetailedTrackResponse
from services.User import get_users


async def add_track(track_data: TrackCreateRequest, supabase_client: SupabaseClient) -> TrackResponse:
    try:
        response = await supabase_client.from_('Track').insert(track_data.model_dump(mode="json")).execute()
        return TrackResponse(**response.data[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add track: {str(e)}")

async def get_all_tracks(supabase_client: SupabaseClient) -> list[DetailedTrackResponse]:
    """Return all tracks with the artist's username as artist_name."""
    try:
        # Fetch raw tracks
        response = await supabase_client.from_("Track").select("*").execute()

        # Fetch users once and build a lookup map
        users = await get_users(supabase_client)
        user_map = {str(user.id): (user.username or "") for user in users}

        detailed_tracks: list[DetailedTrackResponse] = []
        for track in response.data:
            artist_id_str = str(track.get("artist_id")) if track.get("artist_id") is not None else ""
            artist_name = user_map.get(artist_id_str, "")
            track_with_artist = {**track, "artist_name": artist_name}
            detailed_tracks.append(DetailedTrackResponse(**track_with_artist))

        return detailed_tracks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve tracks: {str(e)}")


async def get_all_tracks_by_name(name: str, supabase_client: SupabaseClient) -> list[DetailedTrackResponse]:
    """Return tracks whose title matches name and include artist_name."""
    try:
        response = (
            await supabase_client.from_("Track")
            .select("*")
            .ilike("title", f"%{name}%")
            .execute()
        )

        users = await get_users(supabase_client)
        user_map = {str(user.id): (user.username or "") for user in users}

        detailed_tracks: list[DetailedTrackResponse] = []
        for track in response.data:
            artist_id_str = str(track.get("artist_id")) if track.get("artist_id") is not None else ""
            artist_name = user_map.get(artist_id_str, "")
            track_with_artist = {**track, "artist_name": artist_name}
            detailed_tracks.append(DetailedTrackResponse(**track_with_artist))

        return detailed_tracks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve tracks: {str(e)}")

async def update_track_service(track_id: str, track_data: TrackCreateRequest, supabase_client: SupabaseClient) -> TrackResponse:
    try:
        payload = track_data.model_dump(mode="json", exclude_none=True)
        response = await supabase_client.from_('Track').update(payload).eq('id', track_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail=f"Track with id {track_id} not found")
        return TrackResponse(**response.data[0])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update track: {str(e)}")
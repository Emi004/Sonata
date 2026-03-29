from fastapi import APIRouter, Depends, HTTPException, Query

from models.Track import TrackCreateRequest, TrackResponse
from services.Track import add_track, get_all_tracks, get_all_tracks_by_name, update_track_service
from services.dependencies import get_current_user, get_supabase_client

tracks = APIRouter()


@tracks.post(
    "/upload",
    status_code=201,
    summary="Upload a new track.",
    description="Upload a new track to the system",
    response_description="The created track object",
    response_model=TrackResponse,
)
async def upload_track(
    track: TrackCreateRequest,
    current_user=Depends(get_current_user),
    supabase_client=Depends(get_supabase_client),
):
    if not (current_user.is_admin or current_user.is_artist):
        raise HTTPException(status_code=403, detail="You do not have permission to upload tracks")


    if current_user.is_artist:
        artist_name = current_user.username
    else:  
        if not track.artist_name or not track.artist_name.strip():
            raise HTTPException(status_code=400, detail="artist_name is required when uploading tracks as admin")
        artist_name = track.artist_name.strip()

    enriched_track = TrackCreateRequest(
        title=track.title,
        album_id=track.album_id,
        audio_url=track.audio_url,
        image_url=track.image_url,
        is_published=track.is_published,
        artist_name=artist_name,
        created_by=current_user.id,
    )


    return await add_track(enriched_track, supabase_client)


@tracks.get(
    "",
    status_code=200,
    summary="Get tracks by name query",
    description="Retrieve all tracks matching the name query",
    response_description="A list of track objects",
    response_model=list[TrackResponse],
)
async def get_tracks_by_name(
    name: str | None = Query(None, description="The name of the track to search for"),
    supabase_client=Depends(get_supabase_client),
):
    if name:
        return await get_all_tracks_by_name(name, supabase_client)
    return await get_all_tracks(supabase_client)


@tracks.patch(
    "/{track_id}",
    status_code=200,
    summary="Update a track.",
    description="Update an existing track in the system",
    response_description="The updated track object",
    response_model=TrackResponse,
)
async def update_track(
    track_id: str,
    track: TrackCreateRequest,
    current_user=Depends(get_current_user),
    supabase_client=Depends(get_supabase_client),
) -> TrackResponse:
    if not (current_user.is_admin or current_user.is_artist):
        raise HTTPException(status_code=403, detail="You do not have permission to update tracks")

    return await update_track_service(track_id, track, supabase_client)
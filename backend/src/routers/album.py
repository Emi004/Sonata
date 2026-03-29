from fastapi import APIRouter, Depends, HTTPException, Query

from models.Album import AlbumCreateRequest, AlbumResponse
from services.Album import (
    create_album_service,
    get_all_albums,
    get_all_albums_by_artist,
    update_album_service,
)
from services.dependencies import get_current_user, get_supabase_client


albums = APIRouter()


@albums.get(
    "",
    status_code=200,
    summary="Get all albums.",
    description="Retrieve a list of all albums in the system",
    response_description="A list of albums",
)
async def list_albums(
    artist_name: str | None = Query(None, description="Filter albums by artist name"),
    supabase_client=Depends(get_supabase_client),
) -> list[AlbumResponse]:
    if artist_name:
        return await get_all_albums_by_artist(artist_name, supabase_client)
    return await get_all_albums(supabase_client)


@albums.post(
    "/create",
    status_code=201,
    summary="Create a new album.",
    description="Create a new album in the system",
    response_description="The created album object",
    response_model=AlbumResponse,
)
async def create_album(
    album: AlbumCreateRequest,
    current_user=Depends(get_current_user),
    supabase_client=Depends(get_supabase_client),
) -> AlbumResponse:
    if not (current_user.is_admin or current_user.is_artist):
        raise HTTPException(status_code=403, detail="You do not have permission to create albums")
    

    
    if current_user.is_artist:
        artist_name = current_user.username
    else:  # admin
        if not album.artist_name or not album.artist_name.strip():
            raise HTTPException(status_code=400, detail="artist_name is required when creating albums as admin")
        artist_name = album.artist_name.strip()

    enriched_album = AlbumCreateRequest(
        created_by=current_user.id,  
        title=album.title,
        image_url=album.image_url,
        is_published=album.is_published,
        artist_name=artist_name,
    )
    return await create_album_service(enriched_album, supabase_client)


@albums.patch(
    "/{album_id}",
    status_code=200,
    summary="Update an album.",
    description="Update an existing album in the system",
    response_description="The updated album object",
    response_model=AlbumResponse,
)
async def update_album(
    album_id: str,
    album: AlbumCreateRequest,
    current_user=Depends(get_current_user),
    supabase_client=Depends(get_supabase_client),
) -> AlbumResponse:
    if not (current_user.is_admin or current_user.is_artist):
        raise HTTPException(status_code=403, detail="You do not have permission to update albums")

    return await update_album_service(album_id, album, supabase_client)
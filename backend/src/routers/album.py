from fastapi import APIRouter, Depends, HTTPException, status, Query
from models.Album import AlbumCreateRequest, AlbumResponse
from services.Album import get_all_albums, update_album_service ,get_all_albums_by_artist, create_album_service
from services.dependencies import get_supabase_client, get_current_user


albums=APIRouter()

@albums.get("", status_code=200, summary="Get all albums.", description="Retrieve a list of all albums in the system", response_description="A list of albums")
async def list_albums(artist_name: str = Query(None, description="Filter albums by artist"), supabase_client=Depends(get_supabase_client)) -> list[AlbumResponse]:
    if artist_name:
        return await get_all_albums_by_artist(artist_name, supabase_client)
    else:
        return await get_all_albums(supabase_client)

@albums.post("/create", status_code=201, summary="Create a new album.", description="Create a new album in the system", response_description="The created album object", response_model=AlbumResponse)
async def create_album(album: AlbumCreateRequest, current_user=Depends(get_current_user), supabase_client=Depends(get_supabase_client)) -> AlbumResponse:
    if current_user.is_admin or current_user.is_artist:
        return await create_album_service(album, supabase_client)
    else:
        raise HTTPException(status_code=403, detail="You do not have permission to create albums")

@albums.patch("/{album_id}", status_code=200, summary="Update an album.", description="Update an existing album in the system", response_description="The updated album object", response_model=AlbumResponse)
async def update_album(album_id: str, album: AlbumCreateRequest, current_user=Depends(get_current_user), supabase_client=Depends(get_supabase_client)) -> AlbumResponse:
    if current_user.is_admin or current_user.is_artist:
        response = await update_album_service(album_id, album, supabase_client)
        return response
    else:
        raise HTTPException(status_code=403, detail="You do not have permission to update albums")
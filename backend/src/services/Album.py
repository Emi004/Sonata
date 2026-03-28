from supabase import AsyncClient as SupabaseClient
from models.Album import AlbumCreateRequest, AlbumResponse
from fastapi import HTTPException
from services.User import get_users


async def get_all_albums(supabase_client: SupabaseClient) -> list[AlbumResponse]:
    try:
        response = await supabase_client.from_('Album').select('*').execute()
        return [AlbumResponse(**album) for album in response.data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve albums: {str(e)}")

async def get_all_albums_by_artist(artist_name: str, supabase_client: SupabaseClient) -> list[AlbumResponse]:
    """Return albums where the artist's username contains the given artist_name.

    Looks up all users, then filters albums whose artist_id matches a user id
    and whose username contains the search term (case-insensitive).
    """
    try:
        users = await get_users(supabase_client)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve users: {str(e)}")

    albums = await get_all_albums(supabase_client)

    search = artist_name.lower()
    matching_albums: list[AlbumResponse] = []
    for album in albums:
        artist_id = album.artist_id
        artist = next((user for user in users if str(user.id) == str(artist_id)), None)
        if artist and artist.username and search in artist.username.lower():
            matching_albums.append(album)

    return matching_albums

async def create_album_service(album_data: AlbumCreateRequest, supabase_client: SupabaseClient) -> AlbumResponse:
    try:

        payload = album_data.model_dump(mode="json", exclude_none=True)
        response = await supabase_client.from_('Album').insert(payload).execute()
        return AlbumResponse(**response.data[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create album: {str(e)}")

async def update_album_service(album_id: str, album_data: AlbumCreateRequest, supabase_client: SupabaseClient) -> AlbumResponse:
    try:
        payload = album_data.model_dump(mode="json", exclude_none=True)
        response = await supabase_client.from_('Album').update(payload).eq('id', album_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail=f"Album with id {album_id} not found")
        return AlbumResponse(**response.data[0])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update album: {str(e)}")
from pydantic import BaseModel,ConfigDict
from uuid import UUID

class AlbumResponse(BaseModel):
    id: UUID
    title: str
    created_by: UUID
    image_url: str | None = None
    is_published: bool = False
    artist_name: str

    model_config = ConfigDict(from_attributes=True)

class AlbumCreateRequest(BaseModel):
    title: str
    created_by: UUID
    image_url: str | None = None
    is_published: bool = False
    artist_name: str

    model_config = ConfigDict(from_attributes=True)
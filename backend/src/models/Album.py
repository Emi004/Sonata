from pydantic import BaseModel,ConfigDict
from uuid import UUID

class AlbumResponse(BaseModel):
    id: UUID
    title: str
    artist_id: UUID
    image_url: str | None = None
    is_published: bool = False

    model_config = ConfigDict(from_attributes=True)

class AlbumCreateRequest(BaseModel):
    title: str
    artist_id: UUID
    image_url: str | None = None
    is_published: bool = False

    model_config = ConfigDict(from_attributes=True)
from pydantic import BaseModel, ConfigDict
from uuid import UUID


class TrackResponse(BaseModel):
    id: UUID
    title: str
    created_by: UUID
    audio_url: str
    image_url: str | None = None
    is_published: bool = False
    artist_name: str

    model_config = ConfigDict(from_attributes=True)


class TrackCreateRequest(BaseModel):
    title: str
    created_by: UUID 
    album_id: UUID | None = None
    audio_url: str
    image_url: str | None = None
    is_published: bool = False
    artist_name: str
    
    model_config = ConfigDict(from_attributes=True)
from pydantic import BaseModel,ConfigDict
from uuid import UUID
from datetime import datetime

class TrackResponse(BaseModel):
    id: UUID
    title: str
    artist_id: UUID
    album_id: UUID | None = None
    audio_url: str
    image_url: str | None = None
    is_published: bool = False


    model_config = ConfigDict(from_attributes=True)

class DetailedTrackResponse(BaseModel):
    id: UUID
    title: str
    artist_id: UUID
    album_id: UUID | None = None
    audio_url: str
    image_url: str | None = None
    artist_name: str
    is_published: bool = False


    model_config = ConfigDict(from_attributes=True)

class TrackCreateRequest(BaseModel):
    title: str
    artist_id: UUID
    album_id: UUID | None = None
    audio_url: str
    image_url: str | None = None
    is_published: bool = False

    model_config = ConfigDict(from_attributes=True)
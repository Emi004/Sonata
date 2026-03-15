from pydantic import BaseModel,ConfigDict
from uuid import UUID
from datetime import datetime

class Track(BaseModel):
    id: UUID
    title: str
    genres: list[str] = [] 
    artist_id: UUID
    album_id: UUID | None = None
    audio_url: str
    image_url: str | None = None
    track_number: int | None = None
    is_published: bool = False


    model_config = ConfigDict(from_attributes=True)
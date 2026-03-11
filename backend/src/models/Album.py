from pydantic import BaseModel,ConfigDict
from uuid import UUID
from datetime import datetime,date

class Album(BaseModel):
    id: UUID
    title: str
    artist_id: UUID
    cover_url: str | None = None
    genres: list[str] = []
    release_date: date
    is_published: bool = Falsex

    model_config = ConfigDict(from_attributes=True)

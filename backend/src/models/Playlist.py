from pydantic import BaseModel,ConfigDict
from uuid import UUID
from datetime import datetime

class Playlist(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    description: str | None = None
    imageUrl: str | None = None
    is_public: bool = True
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
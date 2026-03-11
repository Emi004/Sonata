from pydantic import BaseModel,ConfigDict
from uuid import UUID
from datetime import datetime

class User(BaseModel):
    id: UUID
    created_at: datetime
    username: str
    is_artist: bool = False
    is_admin: bool = False
    avatarUrl: str | None

    model_config = ConfigDict(from_attributes=True)
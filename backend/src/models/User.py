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

class UserUpdate(BaseModel):
    username: str | None = None
    avatarUrl: str | None = None

    model_config = ConfigDict(from_attributes=True)

class UserUpdateAdmin(BaseModel):
    username: str | None = None
    avatarUrl: str | None = None
    is_artist: bool | None = None
    is_admin: bool | None = None

    model_config = ConfigDict(from_attributes=True)
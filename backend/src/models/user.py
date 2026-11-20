from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from .task import Task
    from .activity import ActivityLog
    from .view import SavedView
    from .chat import Conversation

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    auth_provider: str = Field(default="local")
    language_preference: str = Field(default="en")

class User(UserBase, table=True):
    __tablename__ = "users"
    user_id: UUID = Field(default_factory=uuid4, primary_key=True)
    hashed_password: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    tasks: List["Task"] = Relationship(back_populates="user")
    activity_logs: List["ActivityLog"] = Relationship(back_populates="user")
    saved_views: List["SavedView"] = Relationship(back_populates="user")
    conversations: List["Conversation"] = Relationship(back_populates="user")

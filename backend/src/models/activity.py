from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship

# Using generic JSON type handling (simplified for SQLModel/Pydantic v2 compatibility)
from pydantic import Json
from sqlalchemy import JSON, Column

if TYPE_CHECKING:
    from .user import User
    from .task import Task

class ActivityLog(SQLModel, table=True):
    __tablename__ = "activity_logs"
    log_id: UUID = Field(default_factory=uuid4, primary_key=True)
    task_id: Optional[UUID] = Field(default=None, foreign_key="tasks.task_id")
    user_id: UUID = Field(foreign_key="users.user_id")
    action: str
    
    # Store arbitrary JSON changes
    changes: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    user: "User" = Relationship(back_populates="activity_logs")
    task: Optional["Task"] = Relationship(back_populates="activity_logs")

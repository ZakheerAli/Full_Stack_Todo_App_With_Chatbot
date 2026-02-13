from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from enum import Enum
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from .user import User
    from .activity import ActivityLog

class Priority(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"

class TaskBase(SQLModel):
    title: str = Field(max_length=255)
    description: Optional[str] = None
    priority: Priority = Field(default=Priority.medium)
    due_date: Optional[datetime] = None
    completed: bool = Field(default=False)

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[Priority] = None
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None

class Task(TaskBase, table=True):
    __tablename__ = "tasks"
    task_id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.user_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None
    
    user: "User" = Relationship(back_populates="tasks")
    activity_logs: List["ActivityLog"] = Relationship(back_populates="task")

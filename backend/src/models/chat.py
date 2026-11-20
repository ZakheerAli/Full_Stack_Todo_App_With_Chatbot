from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, List, Dict, Any, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship, Column, JSON

if TYPE_CHECKING:
    from .user import User

class ConversationBase(SQLModel):
    user_id: UUID = Field(foreign_key="users.user_id")

class Conversation(ConversationBase, table=True):
    __tablename__ = "conversations"
    conversation_id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    user: "User" = Relationship(back_populates="conversations")
    messages: List["Message"] = Relationship(back_populates="conversation")

class MessageBase(SQLModel):
    conversation_id: UUID = Field(foreign_key="conversations.conversation_id")
    role: str # user, assistant, system, tool
    content: str
    tool_calls: Optional[List[Dict[str, Any]]] = Field(default=None, sa_column=Column(JSON))

class Message(MessageBase, table=True):
    __tablename__ = "messages"
    message_id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    conversation: "Conversation" = Relationship(back_populates="messages")

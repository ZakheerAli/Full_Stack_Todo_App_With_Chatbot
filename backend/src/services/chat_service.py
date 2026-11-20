from uuid import UUID
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.chat import Conversation, Message

class ChatService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_conversation(self, user_id: UUID) -> Conversation:
        conversation = Conversation(user_id=user_id)
        self.session.add(conversation)
        await self.session.commit()
        await self.session.refresh(conversation)
        return conversation

    async def get_conversation(self, conversation_id: UUID, user_id: UUID) -> Optional[Conversation]:
        statement = select(Conversation).where(
            Conversation.conversation_id == conversation_id,
            Conversation.user_id == user_id
        )
        result = await self.session.execute(statement)
        return result.scalars().first()

    async def get_user_conversations(self, user_id: UUID) -> List[Conversation]:
        statement = select(Conversation).where(
            Conversation.user_id == user_id
        ).order_by(Conversation.updated_at.desc())
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def add_message(
        self, 
        conversation_id: UUID, 
        role: str, 
        content: str, 
        tool_calls: Optional[List[Dict[str, Any]]] = None
    ) -> Message:
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            tool_calls=tool_calls
        )
        self.session.add(message)
        
        # Update conversation's updated_at
        statement = select(Conversation).where(Conversation.conversation_id == conversation_id)
        result = await self.session.execute(statement)
        conversation = result.scalars().first()
        if conversation:
            conversation.updated_at = datetime.utcnow()
            self.session.add(conversation)
            
        await self.session.commit()
        await self.session.refresh(message)
        return message

    async def get_messages(self, conversation_id: UUID) -> List[Message]:
        statement = select(Message).where(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at.asc())
        result = await self.session.execute(statement)
        return result.scalars().all()

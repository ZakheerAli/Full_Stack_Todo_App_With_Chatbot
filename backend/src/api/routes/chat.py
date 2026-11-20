import logging
from uuid import UUID
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.db import get_session
from src.api.deps import get_active_user
from src.models.user import User
from src.services.chat_service import ChatService
from src.mcp.server import MCPServer
from src.agents.todo_agent import TodoAgent

logger = logging.getLogger(__name__)

router = APIRouter()

def get_user_id(current_user: dict) -> UUID:
    try:
        return UUID(str(current_user.get("user_id")))
    except (ValueError, TypeError):
        return UUID("00000000-0000-0000-0000-000000000000")

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000, description="User prompt or instruction")
    conversation_id: Optional[UUID] = None

class ChatResponse(BaseModel):
    conversation_id: UUID
    response: str
    tool_calls: Optional[List[Dict[str, Any]]] = None

@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: dict = Depends(get_active_user),
    session: AsyncSession = Depends(get_session)
):
    chat_service = ChatService(session)
    user_id = get_user_id(current_user)

    clean_message = request.message.strip()
    if not clean_message:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message cannot be empty")
    
    # 1. Get or create conversation (strictly scoped to authenticated user)
    if request.conversation_id:
        conversation = await chat_service.get_conversation(request.conversation_id, user_id)
        if not conversation:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    else:
        conversation = await chat_service.create_conversation(user_id)
    
    # 2. Add user message to history
    await chat_service.add_message(conversation.conversation_id, "user", clean_message)
    
    # 3. Get full message history
    history = await chat_service.get_messages(conversation.conversation_id)
    
    # 4. Run AI Agent with safe error recovery
    mcp_server = MCPServer(session, user_id)
    agent = TodoAgent(mcp_server)
    
    try:
        agent_response = await agent.run(history)
    except Exception as e:
        err_text = str(e)
        logger.error(f"Error during agent execution: {err_text}", exc_info=True)
        if "429" in err_text or "ResourceExhausted" in err_text:
            friendly_text = "I'm receiving too many requests right now. Please wait a few seconds and try again."
        elif "API_KEY" in err_text or "api_key" in err_text:
            friendly_text = "AI service configuration error: API key is missing or invalid."
        else:
            friendly_text = "I ran into a temporary issue processing your task. Please try again in a moment."

        agent_response = {
            "content": friendly_text,
            "tool_calls": None
        }
    
    # 5. Add assistant message to history
    await chat_service.add_message(
        conversation.conversation_id, 
        "assistant", 
        agent_response["content"],
        agent_response["tool_calls"]
    )
    
    return ChatResponse(
        conversation_id=conversation.conversation_id,
        response=agent_response["content"],
        tool_calls=agent_response["tool_calls"]
    )

@router.get("/conversations")
async def list_conversations(
    current_user: dict = Depends(get_active_user),
    session: AsyncSession = Depends(get_session)
):
    chat_service = ChatService(session)
    user_id = get_user_id(current_user)
    return await chat_service.get_user_conversations(user_id)

@router.get("/conversations/{conversation_id}/messages")
async def list_messages(
    conversation_id: UUID,
    current_user: dict = Depends(get_active_user),
    session: AsyncSession = Depends(get_session)
):
    chat_service = ChatService(session)
    user_id = get_user_id(current_user)
    # Check if conversation belongs to user
    conversation = await chat_service.get_conversation(conversation_id, user_id)
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
        
    return await chat_service.get_messages(conversation_id)

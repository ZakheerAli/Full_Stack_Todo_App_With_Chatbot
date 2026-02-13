from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.db import get_session
from src.api.deps import get_active_user
from src.models.activity import ActivityLog
from src.services.activity_service import ActivityService

router = APIRouter()

def get_user_id(current_user: dict) -> UUID:
    try:
        return UUID(str(current_user.get("user_id")))
    except ValueError:
        return UUID("00000000-0000-0000-0000-000000000000")

@router.get("/", response_model=List[ActivityLog])
async def read_activity(
    limit: int = 50,
    db: AsyncSession = Depends(get_session),
    current_user: dict = Depends(get_active_user),
):
    service = ActivityService(db)
    user_id = get_user_id(current_user)
    return await service.get_user_activity(user_id, limit=limit)

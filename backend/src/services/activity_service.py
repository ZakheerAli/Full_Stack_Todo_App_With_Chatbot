from uuid import UUID
from typing import List, Optional
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.activity import ActivityLog

class ActivityService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def log_activity(
        self, 
        user_id: UUID, 
        action: str, 
        task_id: Optional[UUID] = None, 
        changes: Optional[dict] = None
    ) -> ActivityLog:
        log = ActivityLog(
            user_id=user_id,
            action=action,
            task_id=task_id,
            changes=changes
        )
        self.session.add(log)
        await self.session.commit()
        await self.session.refresh(log)
        return log

    async def get_user_activity(self, user_id: UUID, limit: int = 50) -> List[ActivityLog]:
        statement = select(ActivityLog).where(
            ActivityLog.user_id == user_id
        ).order_by(ActivityLog.created_at.desc()).limit(limit)
        results = await self.session.execute(statement)
        return results.scalars().all()

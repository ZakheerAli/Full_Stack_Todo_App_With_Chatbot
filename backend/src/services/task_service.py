from uuid import UUID
from datetime import datetime
from typing import List, Optional
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.task import Task, TaskBase, TaskUpdate
from fastapi import HTTPException, status
from src.websocket.manager import manager

from src.services.activity_service import ActivityService

class TaskService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.activity_service = ActivityService(session)

    async def create_task(self, task_in: TaskBase, user_id: UUID) -> Task:
        # Create Task object from pydantic model, ignore extra fields if any
        task_data = task_in.model_dump()
        task = Task(**task_data)
        task.user_id = user_id
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        
        # Log activity
        await self.activity_service.log_activity(user_id, "task.created", task.task_id)
        
        # Broadcast event
        await manager.broadcast_to_user(user_id, {"event": "task.created", "task": task.model_dump()})
        return task

    async def get_tasks(
        self, 
        user_id: UUID, 
        skip: int = 0, 
        limit: int = 50,
        status: Optional[bool] = None,
        priority: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Task]:
        statement = select(Task).where(
            Task.user_id == user_id,
            Task.deleted_at == None
        )
        
        if status is not None:
            statement = statement.where(Task.completed == status)
        if priority:
            statement = statement.where(Task.priority == priority)
        if search:
            statement = statement.where(Task.title.contains(search) | Task.description.contains(search))
            
        statement = statement.offset(skip).limit(limit)
        results = await self.session.execute(statement)
        return results.scalars().all()

    async def get_task(self, task_id: UUID, user_id: UUID) -> Optional[Task]:
        statement = select(Task).where(
            Task.task_id == task_id,
            Task.user_id == user_id,
            Task.deleted_at == None
        )
        result = await self.session.execute(statement)
        return result.scalars().first()

    async def update_task(self, task_id: UUID, user_id: UUID, task_update: TaskUpdate) -> Task:
        task = await self.get_task(task_id, user_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        update_data = task_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(task, key, value)
        
        task.updated_at = (lambda: datetime.utcnow())()
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        
        # Broadcast event
        await manager.broadcast_to_user(user_id, {"event": "task.updated", "task": task.model_dump()})
        return task

    async def delete_task(self, task_id: UUID, user_id: UUID) -> bool:
        task = await self.get_task(task_id, user_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
            
        task.deleted_at = (lambda: datetime.utcnow())()
        self.session.add(task)
        await self.session.commit()
        
        # Broadcast event
        await manager.broadcast_to_user(user_id, {"event": "task.deleted", "task_id": str(task_id)})
        return True

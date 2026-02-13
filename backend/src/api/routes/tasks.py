from typing import List, Any, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.db import get_session
from src.api.deps import get_active_user
from src.models.task import Task, TaskBase, TaskUpdate
from src.services.task_service import TaskService

router = APIRouter()

def get_user_id(current_user: dict) -> UUID:
    # Helper to safely get UUID from mock user dict
    try:
        return UUID(str(current_user.get("user_id")))
    except ValueError:
        return UUID("00000000-0000-0000-0000-000000000000")

@router.get("/", response_model=List[Task])
async def read_tasks(
    skip: int = 0,
    limit: int = 50,
    status: Optional[bool] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_session),
    current_user: dict = Depends(get_active_user),
):
    service = TaskService(db)
    user_id = get_user_id(current_user)
    return await service.get_tasks(
        user_id=user_id, 
        skip=skip, 
        limit=limit,
        status=status,
        priority=priority,
        search=search
    )

@router.post("/", response_model=Task)
async def create_task(
    task_in: TaskBase,
    db: AsyncSession = Depends(get_session),
    current_user: dict = Depends(get_active_user),
):
    service = TaskService(db)
    user_id = get_user_id(current_user)
    return await service.create_task(task_in, user_id)

@router.get("/{task_id}", response_model=Task)
async def read_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_session),
    current_user: dict = Depends(get_active_user),
):
    service = TaskService(db)
    user_id = get_user_id(current_user)
    task = await service.get_task(task_id, user_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.patch("/{task_id}", response_model=Task)
async def update_task(
    task_id: UUID,
    task_update: TaskUpdate,
    db: AsyncSession = Depends(get_session),
    current_user: dict = Depends(get_active_user),
):
    service = TaskService(db)
    user_id = get_user_id(current_user)
    return await service.update_task(task_id, user_id, task_update)

@router.delete("/{task_id}")
async def delete_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_session),
    current_user: dict = Depends(get_active_user),
):
    service = TaskService(db)
    user_id = get_user_id(current_user)
    await service.delete_task(task_id, user_id)
    return {"ok": True}

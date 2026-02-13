from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from src.core.db import get_session
from src.api.deps import get_active_user
from src.models.view import SavedView

router = APIRouter()

def get_user_id(current_user: dict) -> UUID:
    try:
        return UUID(str(current_user.get("user_id")))
    except ValueError:
        return UUID("00000000-0000-0000-0000-000000000000")

@router.get("/", response_model=List[SavedView])
async def read_views(
    db: AsyncSession = Depends(get_session),
    current_user: dict = Depends(get_active_user),
):
    user_id = get_user_id(current_user)
    statement = select(SavedView).where(SavedView.user_id == user_id)
    results = await db.execute(statement)
    return results.scalars().all()

@router.post("/", response_model=SavedView)
async def create_view(
    view_in: dict, # Simplified for example
    db: AsyncSession = Depends(get_session),
    current_user: dict = Depends(get_active_user),
):
    user_id = get_user_id(current_user)
    view = SavedView(**view_in, user_id=user_id)
    db.add(view)
    await db.commit()
    await db.refresh(view)
    return view

@router.delete("/{view_id}")
async def delete_view(
    view_id: UUID,
    db: AsyncSession = Depends(get_session),
    current_user: dict = Depends(get_active_user),
):
    user_id = get_user_id(current_user)
    statement = select(SavedView).where(SavedView.view_id == view_id, SavedView.user_id == user_id)
    result = await db.execute(statement)
    view = result.scalars().first()
    if not view:
        raise HTTPException(status_code=404, detail="View not found")
    
    await db.delete(view)
    await db.commit()
    return {"ok": True}

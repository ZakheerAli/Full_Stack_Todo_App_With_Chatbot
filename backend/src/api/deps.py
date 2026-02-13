from fastapi import Depends, HTTPException, status
from src.core.auth import get_current_user

async def get_active_user(user: dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    return user

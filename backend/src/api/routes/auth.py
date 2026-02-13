import logging
from typing import Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.db import get_session
from src.models.user import User
from src.core.security import get_password_hash, verify_password, create_access_token
from src.api.deps import get_active_user
from pydantic import BaseModel

router = APIRouter()
logger = logging.getLogger(__name__)

class UserCreate(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register", response_model=dict)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_session)) -> Any:
    logger.info(f"Registration attempt for: {user_in.email}")
    # Check if user exists
    statement = select(User).where(User.email == user_in.email)
    result = await db.execute(statement)
    if result.scalar_one_or_none():
        logger.warning(f"Registration failed: User {user_in.email} already exists")
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists",
        )
    
    # Create user
    try:
        user = User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
            auth_provider="local"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        logger.info(f"User created: {user.user_id}")
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="Error creating user")
    
    # Auto-login: Create token
    access_token = create_access_token(subject=user.user_id)
    
    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"email": user.email, "user_id": str(user.user_id)}
    }

@router.post("/login", response_model=Token)
async def login(form_data: UserCreate, db: AsyncSession = Depends(get_session)) -> Any:
    logger.info(f"Login attempt for: {form_data.email}")
    # Find user
    statement = select(User).where(User.email == form_data.email)
    result = await db.execute(statement)
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        logger.warning(f"Login failed for: {form_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token = create_access_token(subject=user.user_id)
    logger.info(f"Login successful for: {user.user_id}")
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.get("/me")
async def get_current_user_info(
    current_user: dict = Depends(get_active_user),
    db: AsyncSession = Depends(get_session)
) -> Any:
    """Get the currently authenticated user's information."""
    user_id = current_user.get("user_id")
    statement = select(User).where(User.user_id == UUID(str(user_id)))
    result = await db.execute(statement)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "user_id": str(user.user_id),
        "email": user.email,
        "language_preference": user.language_preference,
        "created_at": user.created_at.isoformat()
    }
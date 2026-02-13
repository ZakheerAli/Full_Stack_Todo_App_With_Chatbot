from fastapi import APIRouter
from .routes import auth, tasks, views, activity

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(views.router, prefix="/views", tags=["views"])
api_router.include_router(activity.router, prefix="/activity", tags=["activity"])

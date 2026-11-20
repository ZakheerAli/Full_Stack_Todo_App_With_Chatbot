from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from .api.api import api_router
from .websocket.endpoint import router as ws_router
from .core.db import engine
from .core.config import settings

# Import all models so they are registered with SQLModel.metadata
from .models.user import User
from .models.task import Task
from .models.activity import ActivityLog
from .models.view import SavedView
from .models.chat import Conversation, Message

import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield

app = FastAPI(title="NexaFlow API", version="0.1.0", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
app.include_router(ws_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to NexaFlow API"}

import os
from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import model_validator

_BACKEND_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "NexaFlow"
    # Default to sqlite for dev if no env set
    DATABASE_URL: str = "sqlite+aiosqlite:///./nexaflow.db"
    SECRET_KEY: Optional[str] = None
    BETTER_AUTH_SECRET: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    @model_validator(mode="after")
    def resolve_secrets_and_clean_urls(self) -> "Settings":
        if self.DATABASE_URL:
            self.DATABASE_URL = self.DATABASE_URL.strip()
        if self.GEMINI_API_KEY:
            self.GEMINI_API_KEY = self.GEMINI_API_KEY.strip()
        if not self.SECRET_KEY:
            if self.BETTER_AUTH_SECRET:
                self.SECRET_KEY = self.BETTER_AUTH_SECRET.strip()
            else:
                self.SECRET_KEY = "nexaflow-dev-fallback-key-do-not-use-in-production"
        else:
            self.SECRET_KEY = self.SECRET_KEY.strip()
        return self

    class Config:
        env_file = (_BACKEND_DIR / ".env", ".env")
        extra = "ignore"

settings = Settings()

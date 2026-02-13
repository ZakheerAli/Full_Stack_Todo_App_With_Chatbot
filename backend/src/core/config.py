from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "NexaFlow"
    # Default to sqlite for dev if no env set, or explicit postgres placeholder
    DATABASE_URL: str = "sqlite+aiosqlite:///./nexaflow.db"
    SECRET_KEY: str = "hackathon-secret-123" # Matching .env default
    BETTER_AUTH_SECRET: str = "hackathon-secret-123"
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

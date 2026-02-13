from fastapi import HTTPException, Security, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from jose import jwt, JWTError
from pydantic import ValidationError
from src.core.config import settings
from src.core.security import ALGORITHM
import logging

# Configure logging
logger = logging.getLogger(__name__)

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[dict]:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            logger.error("Token decoded but 'sub' (user_id) is missing")
            raise HTTPException(status_code=403, detail="Could not validate credentials")
        
        return {"user_id": user_id}
        
    except JWTError as e:
        logger.error(f"JWT Verification Failed: {str(e)}")
        # Log the secret being used (partial) for debugging
        secret_debug = settings.SECRET_KEY[:4] + "***" if settings.SECRET_KEY else "None"
        logger.error(f"Using secret: {secret_debug}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Could not validate credentials: {str(e)}",
        )
    except ValidationError as e:
        logger.error(f"Token Validation Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )

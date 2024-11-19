from typing import Generator
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import SessionLocal

def get_db() -> Generator:
    """
    Database dependency to be used in endpoints.
    Creates a new database session for each request and closes it afterwards.
    """
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

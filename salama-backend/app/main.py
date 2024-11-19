from dotenv import load_dotenv
from fastapi import FastAPI
from .api.v1.api import api_router
from . import models
from .database import engine

# Load environment variables
load_dotenv()

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SALAMA Backend")

# Include API router
app.include_router(api_router, prefix="/api/v1")

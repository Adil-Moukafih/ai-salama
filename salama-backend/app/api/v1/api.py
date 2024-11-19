from fastapi import APIRouter
from .endpoints import cameras, alerts, detection_zones

api_router = APIRouter()

api_router.include_router(
    cameras.router,
    prefix="/cameras",
    tags=["cameras"]
)

api_router.include_router(
    alerts.router,
    prefix="/alerts",
    tags=["alerts"]
)

api_router.include_router(
    detection_zones.router,
    prefix="/detection-zones",
    tags=["detection-zones"]
)

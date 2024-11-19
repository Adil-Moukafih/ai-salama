from typing import Optional, Dict
from datetime import datetime
from pydantic import BaseModel

# Camera schemas
class CameraBase(BaseModel):
    name: str
    location: str
    rtsp_url: str
    status: str = "active"

class CameraCreate(CameraBase):
    pass

class Camera(CameraBase):
    id: int

    class Config:
        from_attributes = True

# Alert schemas
class AlertBase(BaseModel):
    message: str
    severity: str
    camera_id: int

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Detection Zone schemas
class DetectionZoneBase(BaseModel):
    name: str
    camera_id: int
    coordinates: Dict

class DetectionZoneCreate(DetectionZoneBase):
    pass

class DetectionZone(DetectionZoneBase):
    id: int

    class Config:
        from_attributes = True

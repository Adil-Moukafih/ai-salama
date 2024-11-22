from typing import Optional, Dict
from datetime import datetime
from pydantic import BaseModel
from enum import Enum

# Alert Type Enum to match the model
class AlertType(str, Enum):
    MOTION = "motion"
    INTRUSION = "intrusion"
    OBJECT_DETECTION = "object_detection"
    CAMERA_OFFLINE = "camera_offline"
    SYSTEM_ERROR = "system_error"

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
    type: AlertType
    
    # New optional fields for more detailed alerts
    detection_zone: Optional[str] = None
    object_detected: Optional[str] = None
    confidence_score: Optional[str] = None
    additional_metadata: Optional[Dict] = None

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

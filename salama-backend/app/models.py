from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, CheckConstraint
from sqlalchemy.orm import relationship
from .database import Base

class AlertType:
    MOTION = "motion"
    INTRUSION = "intrusion"
    OBJECT_DETECTION = "object_detection"
    CAMERA_OFFLINE = "camera_offline"
    SYSTEM_ERROR = "system_error"

class Camera(Base):
    __tablename__ = "cameras"
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    location = Column(String)
    status = Column(String)
    rtsp_url = Column(String)

    alerts = relationship("Alert", back_populates="camera")
    detection_zones = relationship("DetectionZone", back_populates="camera")

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True)
    camera_id = Column(Integer, ForeignKey("cameras.id"))
    type = Column(String, 
        CheckConstraint("type IN ('motion', 'intrusion', 'object_detection', 'camera_offline', 'system_error')"),
        nullable=False
    )
    message = Column(String)
    severity = Column(String)  # Keep existing severity
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # New detailed fields
    detection_zone = Column(String, nullable=True)  # Specific zone where alert occurred
    object_detected = Column(String, nullable=True)  # Type of object detected
    confidence_score = Column(String, nullable=True)  # Confidence of detection
    additional_metadata = Column(JSON, nullable=True)  # Flexible JSON for extra context

    camera = relationship("Camera", back_populates="alerts")

    def __repr__(self):
        return f"&lt;Alert {self.id}: {self.type} at {self.created_at}&gt;"

class DetectionZone(Base):
    __tablename__ = "detection_zones"
    
    id = Column(Integer, primary_key=True)
    camera_id = Column(Integer, ForeignKey("cameras.id"))
    name = Column(String)
    coordinates = Column(JSON)

    camera = relationship("Camera", back_populates="detection_zones")

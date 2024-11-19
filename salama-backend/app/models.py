from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

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
    message = Column(String)
    severity = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    camera = relationship("Camera", back_populates="alerts")

class DetectionZone(Base):
    __tablename__ = "detection_zones"
    
    id = Column(Integer, primary_key=True)
    camera_id = Column(Integer, ForeignKey("cameras.id"))
    name = Column(String)
    coordinates = Column(JSON)

    camera = relationship("Camera", back_populates="detection_zones")

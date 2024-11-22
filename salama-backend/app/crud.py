from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.orm import Session
from . import models, schemas
import logging

ModelType = TypeVar("ModelType", bound=Any)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).
        """
        self.model = model

    def get(self, db: Session, id: Any) -> Optional[ModelType]:
        return db.query(self.model).filter(self.model.id == id).first()

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[ModelType]:
        return db.query(self.model).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: CreateSchemaType) -> ModelType:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: ModelType, obj_in: Union[UpdateSchemaType, Dict[str, Any]]) -> ModelType:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> ModelType:
        obj = db.query(self.model).get(id)
        db.delete(obj)
        db.commit()
        return obj

class CRUDCamera(CRUDBase[models.Camera, schemas.CameraCreate, schemas.CameraCreate]):
    pass

class CRUDAlert(CRUDBase[models.Alert, schemas.AlertCreate, schemas.AlertCreate]):
    pass

class CRUDDetectionZone(CRUDBase[models.DetectionZone, schemas.DetectionZoneCreate, schemas.DetectionZoneCreate]):
    pass

camera = CRUDCamera(models.Camera)
alert_crud = CRUDAlert(models.Alert)
detection_zone = CRUDDetectionZone(models.DetectionZone)

# Module-level functions to match the existing interface in alerts.py
def get_alerts(db: Session, skip: int = 0, limit: int = 100) -> List[models.Alert]:
    return alert_crud.get_multi(db, skip=skip, limit=limit)

def get_alert(db: Session, alert_id: int) -> Optional[models.Alert]:
    return alert_crud.get(db, id=alert_id)

def create_alert(db: Session, alert: schemas.AlertCreate) -> models.Alert:
    try:
        # Explicit validation for camera_id
        if alert.camera_id is None:
            logger.error("Attempted to create alert with None camera_id")
            raise ValueError("Camera ID cannot be None")
        
        # Log the incoming alert data for debugging
        logger.info(f"Creating alert with data: {alert}")
        
        # Validate alert type
        if alert.type not in [t.value for t in schemas.AlertType]:
            raise ValueError(f"Invalid alert type: {alert.type}")
        
        # Verify camera exists (additional validation)
        existing_camera = db.query(models.Camera).filter(models.Camera.id == alert.camera_id).first()
        if not existing_camera:
            logger.error(f"Attempted to create alert for non-existent camera ID: {alert.camera_id}")
            raise ValueError(f"Camera with ID {alert.camera_id} does not exist")
        
        # Create the alert using the alert_crud object
        new_alert = alert_crud.create(db, obj_in=alert)
        
        logger.info(f"Alert created successfully: {new_alert}")
        return new_alert
    except Exception as e:
        logger.error(f"Error creating alert: {str(e)}")
        raise

def delete_alert(db: Session, alert_id: int) -> models.Alert:
    return alert_crud.remove(db, id=alert_id)

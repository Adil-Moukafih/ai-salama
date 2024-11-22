from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging

from .... import crud, models, schemas
from ....api import deps

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=List[schemas.Alert])
def read_alerts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db)
):
    """Retrieve alerts."""
    return crud.get_alerts(db, skip=skip, limit=limit)

@router.get("/{alert_id}", response_model=schemas.Alert)
def read_alert(
    alert_id: int,
    db: Session = Depends(deps.get_db)
):
    """Get alert by ID."""
    alert = crud.get_alert(db, alert_id=alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.post("/", response_model=schemas.Alert)
def create_alert(
    alert: schemas.AlertCreate,
    db: Session = Depends(deps.get_db)
):
    """Create new alert."""
    try:
        # Log the full details of the incoming alert
        logger.info(f"Received alert creation request:")
        logger.info(f"Message: {alert.message}")
        logger.info(f"Severity: {alert.severity}")
        logger.info(f"Camera ID: {alert.camera_id}")
        logger.info(f"Type: {alert.type}")
        logger.info(f"Detection Zone: {alert.detection_zone}")
        logger.info(f"Object Detected: {alert.object_detected}")
        logger.info(f"Confidence Score: {alert.confidence_score}")
        logger.info(f"Additional Metadata: {alert.additional_metadata}")

        # Validate camera exists before creating alert
        camera = db.query(models.Camera).filter(models.Camera.id == alert.camera_id).first()
        if not camera:
            raise HTTPException(status_code=400, detail=f"Camera with ID {alert.camera_id} does not exist")

        # Create the alert
        created_alert = crud.create_alert(db=db, alert=alert)
        
        logger.info(f"Alert created successfully: {created_alert}")
        return created_alert
    except Exception as e:
        logger.error(f"Error creating alert: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating alert: {str(e)}")

@router.delete("/{alert_id}", response_model=schemas.Alert)
def delete_alert(
    alert_id: int,
    db: Session = Depends(deps.get_db)
):
    """Delete alert."""
    alert = crud.get_alert(db, alert_id=alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return crud.delete_alert(db=db, alert_id=alert_id)

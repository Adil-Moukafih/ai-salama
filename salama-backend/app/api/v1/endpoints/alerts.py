from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .... import crud, models, schemas
from ....api import deps

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
    return crud.create_alert(db=db, alert=alert)

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

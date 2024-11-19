from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .... import crud, models, schemas
from ....api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.DetectionZone])
def read_zones(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db)
):
    """Retrieve detection zones."""
    return crud.get_zones(db, skip=skip, limit=limit)

@router.get("/{zone_id}", response_model=schemas.DetectionZone)
def read_zone(
    zone_id: int,
    db: Session = Depends(deps.get_db)
):
    """Get detection zone by ID."""
    zone = crud.get_zone(db, zone_id=zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Detection zone not found")
    return zone

@router.post("/", response_model=schemas.DetectionZone)
def create_zone(
    zone: schemas.DetectionZoneCreate,
    db: Session = Depends(deps.get_db)
):
    """Create new detection zone."""
    return crud.create_zone(db=db, zone=zone)

@router.put("/{zone_id}", response_model=schemas.DetectionZone)
def update_zone(
    zone_id: int,
    zone: schemas.DetectionZoneCreate,
    db: Session = Depends(deps.get_db)
):
    """Update detection zone."""
    db_zone = crud.get_zone(db, zone_id=zone_id)
    if not db_zone:
        raise HTTPException(status_code=404, detail="Detection zone not found")
    return crud.update_zone(db=db, zone_id=zone_id, zone=zone)

@router.delete("/{zone_id}", response_model=schemas.DetectionZone)
def delete_zone(
    zone_id: int,
    db: Session = Depends(deps.get_db)
):
    """Delete detection zone."""
    zone = crud.get_zone(db, zone_id=zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Detection zone not found")
    return crud.delete_zone(db=db, zone_id=zone_id)

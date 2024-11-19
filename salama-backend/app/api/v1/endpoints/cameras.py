from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.responses import StreamingResponse
from io import BytesIO

from .... import crud, models, schemas
from ....core.camera_service import CameraService
from ....api import deps

router = APIRouter()

@router.post("/", response_model=schemas.Camera)
def create_camera(
    camera: schemas.CameraCreate,
    db: Session = Depends(deps.get_db)
):
    """Create new camera."""
    return crud.camera.create(db=db, obj_in=camera)

@router.get("/", response_model=List[schemas.Camera])
def read_cameras(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db)
):
    """Retrieve cameras."""
    return crud.camera.get_multi(db=db, skip=skip, limit=limit)

@router.get("/{camera_id}", response_model=schemas.Camera)
def read_camera(
    camera_id: int,
    db: Session = Depends(deps.get_db)
):
    """Get camera by ID."""
    camera = crud.camera.get(db=db, id=camera_id)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return camera

@router.put("/{camera_id}", response_model=schemas.Camera)
def update_camera(
    camera_id: int,
    camera_in: schemas.CameraCreate,
    db: Session = Depends(deps.get_db)
):
    """Update camera."""
    camera = crud.camera.get(db=db, id=camera_id)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return crud.camera.update(db=db, db_obj=camera, obj_in=camera_in)

@router.delete("/{camera_id}")
def delete_camera(
    camera_id: int,
    db: Session = Depends(deps.get_db)
):
    """Delete camera."""
    camera = crud.camera.get(db=db, id=camera_id)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return crud.camera.remove(db=db, id=camera_id)

@router.get("/{camera_id}/snapshot")
async def get_camera_snapshot(
    camera_id: int,
    db: Session = Depends(deps.get_db)
):
    """Get snapshot from camera."""
    camera = crud.camera.get(db=db, id=camera_id)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    # Get snapshot using camera service
    camera_service = CameraService()
    image_bytes = await camera_service.get_camera_snapshot(camera.rtsp_url)
    
    # Return image
    return StreamingResponse(
        BytesIO(image_bytes), 
        media_type="image/jpeg"
    )

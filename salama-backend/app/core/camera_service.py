import cv2
import numpy as np
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
import io
from PIL import Image

class CameraService:
    @staticmethod
    async def get_camera_snapshot(rtsp_url: str) -> bytes:
        """Capture snapshot from camera RTSP stream."""
        try:
            # Open video capture
            cap = cv2.VideoCapture(rtsp_url)
            if not cap.isOpened():
                raise HTTPException(
                    status_code=500,
                    detail="Failed to connect to camera stream"
                )

            # Try to read frame with timeout
            ret, frame = cap.read()
            if not ret:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to capture frame from camera"
                )

            # Release capture immediately
            cap.release()

            # Convert to JPEG
            try:
                _, buffer = cv2.imencode('.jpg', frame)
                return buffer.tobytes()
            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to encode image"
                )

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Camera snapshot error: {str(e)}"
            )
        finally:
            # Ensure capture is released
            if 'cap' in locals():
                cap.release()

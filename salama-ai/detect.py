#!/usr/bin/env python3
import os
import requests
import cv2
import numpy as np
from ultralytics import YOLO

# Configuration
BASE_URL = "http://localhost:8000/api/v1"
CAMERAS_URL = f"{BASE_URL}/cameras/"
SNAPSHOT_URL = f"{BASE_URL}/cameras/{{camera_id}}/snapshot"
ALERTS_URL = f"{BASE_URL}/alerts/"

def get_cameras():
    """Fetch list of cameras from backend"""
    print("🔍 Fetching camera list from backend...")
    try:
        response = requests.get(CAMERAS_URL)
        response.raise_for_status()
        cameras = response.json()
        print(f"✅ Found {len(cameras)} cameras")
        return cameras
    except requests.RequestException as e:
        print(f"❌ Error fetching cameras: {e}")
        return []

def get_camera_snapshot(camera_id):
    """Fetch snapshot for a specific camera"""
    print(f"📸 Getting snapshot for camera ID: {camera_id}")
    try:
        response = requests.get(SNAPSHOT_URL.format(camera_id=camera_id), stream=True)
        response.raise_for_status()
        
        # Save snapshot temporarily
        with open('snapshot.jpg', 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print("✅ Snapshot saved successfully")
        return 'snapshot.jpg'
    except requests.RequestException as e:
        print(f"❌ Error fetching snapshot for camera {camera_id}: {e}")
        return None

def detect_objects(image_path):
    """Perform YOLO object detection"""
    print("🤖 Starting YOLO object detection...")
    try:
        # Load pre-trained YOLOv8 model
        model = YOLO('yolov8n.pt')  # You can change to a different model if needed
        
        # Run inference
        results = model(image_path)
        
        # Filter for specific objects (e.g., person, car, bottle)
        detected_objects = [
            model.names[int(result.cls)] 
            for result in results[0].boxes 
            if model.names[int(result.cls)] in ['person', 'car', 'bottle']
        ]
        
        if detected_objects:
            print(f"🚨 Detected objects: {detected_objects}")
        else:
            print("🟢 No persons, cars, or bottles detected")
        
        return detected_objects
    except Exception as e:
        print(f"❌ Detection error: {e}")
        return []

def send_alert(camera_id, objects):
    """Send alert to backend if objects detected"""
    if not objects:
        return
    
    print("📡 Sending alert to backend...")
    try:
        alert_data = {
            "camera_id": camera_id,
            "type": "object_detection",
            "severity": "medium",
            "message": f"Objects detected: {', '.join(objects)}",
            "object_detected": objects[0] if objects else None,
            "confidence_score": "0.7",  # Example confidence score
            "additional_metadata": {
                "total_objects": len(objects),
                "detection_method": "YOLO"
            }
        }
        
        response = requests.post(ALERTS_URL, json=alert_data)
        response.raise_for_status()
        print("✅ Alert sent successfully")
    except requests.RequestException as e:
        print(f"❌ Error sending alert: {response.text}")
        print(f"Error details: {e}")

def main():
    print("🚀 Starting Salama AI Detection Script")
    
    # Get list of cameras
    cameras = get_cameras()
    
    if not cameras:
        print("❌ No cameras found. Exiting.")
        return
    
    # Process first camera (you can modify to process all cameras)
    camera = cameras[0]
    camera_id = camera['id']
    print(f"📹 Processing camera: {camera}")
    
    # Fetch snapshot
    snapshot_path = get_camera_snapshot(camera_id)
    if not snapshot_path:
        return
    
    # Detect objects
    detected_objects = detect_objects(snapshot_path)
    
    # Send alert if objects detected
    send_alert(camera_id, detected_objects)
    
    # Clean up temporary snapshot
    if os.path.exists(snapshot_path):
        os.remove(snapshot_path)
    
    print("🏁 Detection script completed")

if __name__ == "__main__":
    main()

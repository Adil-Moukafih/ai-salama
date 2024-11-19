# SALAMA Technical Documentation - Part 3

## 7. API Design

### 7.1 RESTful API Endpoints
```python
# FastAPI Router Structure
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional

# Cameras Router
router_cameras = APIRouter(prefix="/api/cameras")

@router_cameras.get("/", response_model=List[CameraResponse])
async def list_cameras(
    status: Optional[str] = None,
    location: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """List all cameras with optional filtering."""
    ...

@router_cameras.post("/{camera_id}/zones")
async def create_detection_zone(
    camera_id: UUID,
    zone: DetectionZoneCreate,
    current_user: User = Depends(get_current_user)
):
    """Create new detection zone for camera."""
    ...

# Alerts Router
router_alerts = APIRouter(prefix="/api/alerts")

@router_alerts.get("/", response_model=PaginatedAlertResponse)
async def list_alerts(
    camera_id: Optional[UUID] = None,
    severity: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    page: int = 1,
    page_size: int = 50,
    current_user: User = Depends(get_current_user)
):
    """Get paginated list of alerts with filtering."""
    ...

# Analytics Router
router_analytics = APIRouter(prefix="/api/analytics")

@router_analytics.get("/metrics")
async def get_metrics(
    metric_type: str,
    time_range: str,
    aggregation: str = "1h",
    current_user: User = Depends(get_current_user)
):
    """Get system metrics with time-based aggregation."""
    ...
```

### 7.2 WebSocket Endpoints
```python
# WebSocket Routes
@app.websocket("/ws/camera/{camera_id}")
async def camera_websocket(
    websocket: WebSocket, 
    camera_id: str, 
    token: str = Query(...)
):
    try:
        # Verify token
        user = await verify_ws_token(token)
        if not user:
            await websocket.close(code=4001)
            return

        # Connect to camera stream
        await manager.connect(websocket, camera_id)
        
        # Start frame processing
        processor = FrameProcessor()
        await processor.process_stream(camera_id, websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close(code=1011)
```

### 7.3 API Response Models
```python
# Pydantic Models for API Responses
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class CameraResponse(BaseModel):
    id: UUID
    name: str
    location: str
    status: str
    stream_url: str
    last_maintenance: Optional[datetime]
    detection_zones: List[DetectionZone]
    metrics: Optional[CameraMetrics]

    class Config:
        from_attributes = True

class AlertResponse(BaseModel):
    id: UUID
    camera_id: UUID
    alert_type: str
    severity: str
    description: str
    ai_confidence: float
    detection_data: dict
    status: str
    detected_at: datetime
    resolved_at: Optional[datetime]

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    pages: int
    has_next: bool
    has_prev: bool
```

## 8. Security Implementation

### 8.1 Authentication System
```python
# JWT Authentication
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

class AuthService:
    def __init__(self):
        self.pwd_context = CryptContext(
            schemes=["bcrypt"], 
            deprecated="auto"
        )
        self.secret_key = settings.SECRET_KEY
        self.algorithm = "HS256"
        self.access_token_expire = timedelta(minutes=30)
        self.refresh_token_expire = timedelta(days=7)

    def create_access_token(
        self, 
        data: dict
    ) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + self.access_token_expire
        to_encode.update({"exp": expire})
        return jwt.encode(
            to_encode, 
            self.secret_key, 
            algorithm=self.algorithm
        )

    async def authenticate_user(
        self, 
        username: str, 
        password: str
    ) -> Optional[User]:
        user = await get_user_by_username(username)
        if not user:
            return None
        if not self.verify_password(password, user.password):
            return None
        return user
```

### 8.2 Authorization & RBAC
```python
# Role-Based Access Control
from enum import Enum
from typing import List

class UserRole(str, Enum):
    ADMIN = "admin"
    OPERATOR = "operator"
    VIEWER = "viewer"

class Permission(str, Enum):
    READ_CAMERAS = "read:cameras"
    WRITE_CAMERAS = "write:cameras"
    MANAGE_ALERTS = "manage:alerts"
    VIEW_ANALYTICS = "view:analytics"
    ADMIN_ACCESS = "admin:access"

ROLE_PERMISSIONS = {
    UserRole.ADMIN: [p.value for p in Permission],
    UserRole.OPERATOR: [
        Permission.READ_CAMERAS,
        Permission.MANAGE_ALERTS,
        Permission.VIEW_ANALYTICS
    ],
    UserRole.VIEWER: [
        Permission.READ_CAMERAS,
        Permission.VIEW_ANALYTICS
    ]
}

def check_permission(
    required_permission: Permission,
    user_role: UserRole
) -> bool:
    return required_permission in ROLE_PERMISSIONS[user_role]
```

### 8.3 Security Middleware
```python
# Security Middleware Configuration
from fastapi import Security
from fastapi.security import OAuth2PasswordBearer
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = \
        "max-age=31536000; includeSubDomains"
    return response
```

## 9. Deployment Configuration

### 9.1 Docker Setup
```dockerfile
# Production Dockerfile
FROM nvidia/cuda:12.1.0-base-ubuntu22.04 as base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3-pip \
    libgl1-mesa-glx \
    libglib2.0-0

# Create app directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Copy application code
COPY . .

# Start application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 9.2 Kubernetes Configuration
```yaml
# Kubernetes Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: salama-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: salama-api
  template:
    metadata:
      labels:
        app: salama-api
    spec:
      containers:
      - name: api
        image: salama/api:latest
        resources:
          limits:
            nvidia.com/gpu: 1
          requests:
            memory: "4Gi"
            cpu: "2"
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: salama-secrets
              key: database-url
        ports:
        - containerPort: 8000
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 10
```

### 9.3 CI/CD Pipeline
```yaml
# GitHub Actions Workflow
name: SALAMA CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    - name: Run tests
      run: |
        pip install -r requirements.txt
        pytest

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        push: true
        tags: salama/api:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Kubernetes
      uses: azure/k8s-deploy@v1
      with:
        manifests: |
          k8s/deployment.yaml
          k8s/service.yaml
```

[Continue to Part 4: Monitoring, Logging, and Testing Strategy...]
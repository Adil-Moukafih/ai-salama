# SALAMA Technical Documentation - Part 2

## 4. Database Architecture

### 4.1 Database Schema
```sql
-- Core Tables
CREATE TABLE cameras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    stream_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    config JSONB,
    last_maintenance TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detection_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    camera_id UUID REFERENCES cameras(id),
    zone_type VARCHAR(50) NOT NULL,  -- platform_edge, track, restricted
    coordinates JSONB NOT NULL,
    active BOOLEAN DEFAULT true,
    sensitivity INT DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    camera_id UUID REFERENCES cameras(id),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    description TEXT,
    ai_confidence FLOAT,
    metadata JSONB,
    status VARCHAR(50) DEFAULT 'new',
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT
);

-- Time-series Tables (Using TimescaleDB)
CREATE TABLE metrics (
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    camera_id UUID,
    metric_type VARCHAR(50),
    value FLOAT,
    metadata JSONB
);
SELECT create_hypertable('metrics', 'time');

-- AI Model Performance Tracking
CREATE TABLE model_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_type VARCHAR(50),  -- yolo, llama
    inference_time FLOAT,
    accuracy FLOAT,
    batch_size INT,
    metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 Database Indices
```sql
-- Performance Optimization Indices
CREATE INDEX idx_alerts_camera_id ON alerts(camera_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_detected_at ON alerts(detected_at DESC);
CREATE INDEX idx_camera_status ON cameras(status);
CREATE INDEX idx_metrics_camera_type ON metrics(camera_id, metric_type);
```

## 5. Frontend Architecture

### 5.1 Module Structure
```typescript
// Frontend Application Structure
interface AppModules {
  core: {
    layout: "Layout components and templates",
    routing: "Next.js App Router configuration",
    auth: "Authentication and authorization",
    theme: "Dark/light mode and styling"
  },
  
  features: {
    dashboard: "Main monitoring dashboard",
    cameras: "Camera management and viewing",
    alerts: "Alert management and history",
    analytics: "Performance and statistics",
    settings: "System configuration"
  },
  
  shared: {
    components: "Reusable UI components",
    hooks: "Custom React hooks",
    utils: "Utility functions",
    api: "API client and types"
  }
}
```

### 5.2 State Management
```typescript
// Zustand Store Structure
interface RootStore {
  cameras: {
    list: Camera[];
    active: Camera | null;
    loading: boolean;
    error: Error | null;
    setCameras: (cameras: Camera[]) => void;
    updateCamera: (camera: Camera) => void;
  };
  
  alerts: {
    list: Alert[];
    filters: AlertFilters;
    statistics: AlertStats;
    addAlert: (alert: Alert) => void;
    updateAlert: (alert: Alert) => void;
    setFilters: (filters: AlertFilters) => void;
  };
  
  system: {
    config: SystemConfig;
    status: SystemStatus;
    updateConfig: (config: Partial<SystemConfig>) => void;
    updateStatus: (status: Partial<SystemStatus>) => void;
  };
}
```

### 5.3 Component Examples
```tsx
// Smart Camera Component
interface CameraViewProps {
  cameraId: string;
  showControls?: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ 
  cameraId, 
  showControls 
}) => {
  const camera = useCameraStore(state => 
    state.cameras.find(c => c.id === cameraId)
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/camera/${cameraId}`);
    ws.onmessage = (event) => {
      // Handle incoming frames and detection overlays
    };
    return () => ws.close();
  }, [cameraId]);

  return (
    <div className="relative">
      <video 
        ref={videoRef} 
        className="w-full rounded-lg"
        autoPlay 
      />
      <DetectionOverlay data={detectionData} />
      {showControls && <CameraControls camera={camera} />}
    </div>
  );
};

// Alert Panel Component
const AlertPanel: React.FC = () => {
  const alerts = useAlertStore(state => state.alerts);
  const [parent] = useAutoAnimate();

  return (
    <div ref={parent} className="space-y-2">
      {alerts.map(alert => (
        <AlertCard
          key={alert.id}
          alert={alert}
          onAcknowledge={handleAcknowledge}
          onResolve={handleResolve}
        />
      ))}
    </div>
  );
};
```

## 6. Backend Services

### 6.1 FastAPI Service Structure
```python
# Core Service Architecture
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SALAMA API",
    description="Railway Safety AI Monitoring System",
    version="1.0.0"
)

# Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# WebSocket Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, camera_id: str):
        await websocket.accept()
        if camera_id not in self.active_connections:
            self.active_connections[camera_id] = []
        self.active_connections[camera_id].append(websocket)

    async def broadcast(self, camera_id: str, data: Any):
        if camera_id in self.active_connections:
            for connection in self.active_connections[camera_id]:
                await connection.send_json(data)

manager = ConnectionManager()
```

### 6.2 AI Service Integration
```python
# AI Service Orchestration
class AIService:
    def __init__(self):
        self.yolo = YOLODetector()
        self.llama = LLaMAAnalyzer()
        self.alert_service = AlertService()

    async def process_frame(
        self, 
        frame: np.ndarray, 
        camera_id: str
    ) -> Dict[str, Any]:
        # YOLOv5 Detection
        detections = await self.yolo.detect(frame)
        
        if detections:
            # LLaMA Analysis
            context = self.format_context(detections)
            analysis = await self.llama.analyze(context)
            
            if analysis.alert_required:
                await self.alert_service.create_alert(
                    camera_id=camera_id,
                    detection_data=detections,
                    analysis_result=analysis
                )
            
            return {
                "detections": detections,
                "analysis": analysis,
                "frame_id": uuid.uuid4()
            }
        
        return {"frame_id": uuid.uuid4()}

# Frame Processing Pipeline
class FrameProcessor:
    def __init__(self):
        self.ai_service = AIService()
        self.frame_buffer = FrameBuffer()

    async def process_stream(
        self, 
        camera_id: str, 
        websocket: WebSocket
    ):
        async for frame in self.frame_buffer.get_frames(camera_id):
            result = await self.ai_service.process_frame(
                frame, 
                camera_id
            )
            await websocket.send_json(result)
```

### 6.3 Background Tasks
```python
# Celery Task Configuration
from celery import Celery

celery_app = Celery(
    'salama',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/1'
)

@celery_app.task
def analyze_historical_data(
    start_date: datetime,
    end_date: datetime
) -> Dict[str, Any]:
    """Analyze historical data for patterns and insights."""
    pass

@celery_app.task
def generate_performance_report(
    camera_id: str,
    time_range: str
) -> bytes:
    """Generate PDF performance report."""
    pass
```

[Continue to Part 3: API Design, Deployment, and Security...]
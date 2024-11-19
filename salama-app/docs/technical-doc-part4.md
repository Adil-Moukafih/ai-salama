# SALAMA Technical Documentation - Part 4

## 10. Monitoring & Observability

### 10.1 Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'salama-api'
    static_configs:
      - targets: ['api:8000']
    metrics_path: '/metrics'

  - job_name: 'salama-gpu'
    static_configs:
      - targets: ['gpu-exporter:9400']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

### 10.2 Custom Metrics Implementation
```python
# Metrics Collection
from prometheus_client import Counter, Histogram, Gauge
from functools import wraps
import time

# Define metrics
DETECTION_LATENCY = Histogram(
    'detection_latency_seconds',
    'Time spent processing each frame',
    ['camera_id', 'model_type']
)

ALERT_COUNTER = Counter(
    'alerts_total',
    'Total number of alerts generated',
    ['severity', 'camera_id']
)

GPU_UTILIZATION = Gauge(
    'gpu_utilization_percent',
    'GPU utilization percentage',
    ['gpu_id']
)

# Metric collection decorator
def track_latency(model_type: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            camera_id = kwargs.get('camera_id', 'unknown')
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                DETECTION_LATENCY.labels(
                    camera_id=camera_id,
                    model_type=model_type
                ).observe(time.time() - start_time)
                return result
            except Exception as e:
                # Track errors
                ERROR_COUNTER.labels(
                    camera_id=camera_id,
                    error_type=type(e).__name__
                ).inc()
                raise
        return wrapper
    return decorator

# Usage example
@track_latency('yolov5')
async def process_frame(frame: np.ndarray, camera_id: str):
    # Process frame
    pass
```

### 10.3 Grafana Dashboards
```typescript
// Dashboard Configuration
const dashboardConfig = {
  panels: [
    {
      title: 'System Overview',
      type: 'row',
      panels: [
        {
          title: 'Active Cameras',
          type: 'stat',
          targets: [{
            expr: 'sum(camera_status{status="active"})'
          }]
        },
        {
          title: 'Alert Rate',
          type: 'graph',
          targets: [{
            expr: 'rate(alerts_total[5m])',
            legendFormat: '{{severity}}'
          }]
        }
      ]
    },
    {
      title: 'AI Performance',
      type: 'row',
      panels: [
        {
          title: 'Detection Latency',
          type: 'heatmap',
          targets: [{
            expr: 'rate(detection_latency_seconds_bucket[5m])'
          }]
        },
        {
          title: 'GPU Utilization',
          type: 'gauge',
          targets: [{
            expr: 'gpu_utilization_percent'
          }]
        }
      ]
    }
  ]
};
```

## 11. Logging Strategy

### 11.1 Structured Logging Setup
```python
# Logging Configuration
import structlog
from typing import Any, Dict

def setup_logging():
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.JSONRenderer()
        ],
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True
    )

# Custom logger with context
class ContextLogger:
    def __init__(self):
        self.logger = structlog.get_logger()

    def bind_context(self, **kwargs):
        return self.logger.bind(**kwargs)

    async def log_event(
        self,
        event: str,
        level: str = "info",
        **kwargs
    ):
        log_method = getattr(self.logger, level)
        log_method(
            event,
            **kwargs
        )

# Usage example
logger = ContextLogger()

@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())
    logger_with_context = logger.bind_context(
        request_id=request_id,
        path=request.url.path
    )
    
    try:
        response = await call_next(request)
        await logger_with_context.log_event(
            "request_processed",
            status_code=response.status_code
        )
        return response
    except Exception as e:
        await logger_with_context.log_event(
            "request_failed",
            level="error",
            error=str(e)
        )
        raise
```

### 11.2 ELK Stack Configuration
```yaml
# docker-compose.elk.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.9.0
    environment:
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms1g -Xmx1g
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:8.9.0
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.9.0
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
```

## 12. Testing Strategy

### 12.1 Unit Testing
```python
# test_detection.py
import pytest
from unittest.mock import Mock, patch
import numpy as np
from app.services.detection import YOLODetector

@pytest.fixture
def mock_frame():
    return np.zeros((640, 480, 3), dtype=np.uint8)

@pytest.fixture
def detector():
    with patch('torch.hub.load') as mock_load:
        mock_model = Mock()
        mock_load.return_value = mock_model
        detector = YOLODetector()
        return detector

async def test_detection(detector, mock_frame):
    # Arrange
    expected_detections = [
        {
            'class': 0,
            'confidence': 0.95,
            'bbox': [100, 100, 200, 200]
        }
    ]
    detector.model.return_value.pandas.return_value.xyxy = \
        [expected_detections]

    # Act
    result = await detector.detect(mock_frame)

    # Assert
    assert len(result) == 1
    assert result[0]['confidence'] == 0.95
```

### 12.2 Integration Testing
```python
# test_api_integration.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_camera_stream():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Arrange
        camera_id = "test-camera"
        
        # Act
        response = await client.get(f"/api/cameras/{camera_id}/stream")
        
        # Assert
        assert response.status_code == 200
        assert "stream_url" in response.json()

@pytest.mark.asyncio
async def test_alert_creation():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Arrange
        alert_data = {
            "camera_id": "test-camera",
            "alert_type": "person_detected",
            "severity": "high"
        }
        
        # Act
        response = await client.post("/api/alerts", json=alert_data)
        
        # Assert
        assert response.status_code == 201
        data = response.json()
        assert data["alert_type"] == alert_data["alert_type"]
```

### 12.3 Performance Testing
```python
# locustfile.py
from locust import HttpUser, task, between

class SALAMAUser(HttpUser):
    wait_time = between(1, 2)

    def on_start(self):
        # Login and store token
        response = self.client.post("/auth/login", json={
            "username": "test_user",
            "password": "test_password"
        })
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}

    @task(3)
    def get_camera_status(self):
        self.client.get(
            "/api/cameras/status",
            headers=self.headers
        )

    @task(2)
    def get_active_alerts(self):
        self.client.get(
            "/api/alerts?status=active",
            headers=self.headers
        )

    @task(1)
    def get_analytics(self):
        self.client.get(
            "/api/analytics/summary",
            headers=self.headers
        )
```

[Continue to Part 5: System Optimization and Scaling Strategy...]
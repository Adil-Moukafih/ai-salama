# SALAMA Technical Documentation - Part 9

## 20. Integration Patterns

### 20.1 API Gateway
```python
# API Gateway Implementation
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

class SALAMAGateway:
    """API Gateway for SALAMA services."""
    
    def __init__(self):
        self.app = FastAPI(title="SALAMA API Gateway")
        self.service_registry = ServiceRegistry()
        self.rate_limiter = RateLimiter()
        self.auth_service = AuthenticationService()
        
        # Configure CORS
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"]
        )
        
        # Add middleware
        self.app.middleware("http")(self.gateway_middleware)
        
    async def gateway_middleware(
        self,
        request: Request,
        call_next: callable
    ) -> Response:
        """Process all incoming requests."""
        try:
            # Rate limiting check
            await self.rate_limiter.check_rate_limit(request)
            
            # Authentication
            token = await self.auth_service.authenticate(request)
            
            # Route to appropriate service
            service = await self.service_registry.get_service(
                request.url.path
            )
            
            # Add tracing headers
            request.headers["X-Trace-ID"] = str(uuid.uuid4())
            
            # Forward request
            response = await service.handle_request(request)
            
            return response
            
        except Exception as e:
            return self._handle_error(e)
            
    async def _handle_error(
        self,
        error: Exception
    ) -> Response:
        """Handle gateway errors."""
        error_handlers = {
            RateLimitExceeded: self._handle_rate_limit,
            AuthenticationError: self._handle_auth_error,
            ServiceNotFound: self._handle_service_error
        }
        
        handler = error_handlers.get(
            type(error),
            self._handle_generic_error
        )
        return await handler(error)
```

### 20.2 Service Discovery
```python
# Service Discovery Implementation
from dataclasses import dataclass
from typing import Dict, List, Optional

@dataclass
class ServiceInstance:
    """Service instance details."""
    
    id: str
    name: str
    host: str
    port: int
    health_check_url: str
    metadata: Dict[str, Any]
    last_heartbeat: datetime

class ServiceRegistry:
    """Service discovery and registration."""
    
    def __init__(self):
        self.services: Dict[str, List[ServiceInstance]] = {}
        self.health_checker = HealthChecker()
        
    async def register_service(
        self,
        service: ServiceInstance
    ) -> None:
        """Register a new service instance."""
        if service.name not in self.services:
            self.services[service.name] = []
            
        self.services[service.name].append(service)
        await self._start_health_checks(service)
        
    async def get_service(
        self,
        service_name: str,
        metadata_filter: Optional[Dict[str, Any]] = None
    ) -> ServiceInstance:
        """Get available service instance."""
        instances = self.services.get(service_name, [])
        
        if not instances:
            raise ServiceNotFound(f"No instances found for {service_name}")
            
        # Filter by metadata if provided
        if metadata_filter:
            instances = [
                i for i in instances
                if all(
                    i.metadata.get(k) == v 
                    for k, v in metadata_filter.items()
                )
            ]
            
        # Load balancing logic
        return self._select_instance(instances)
        
    async def _start_health_checks(
        self,
        service: ServiceInstance
    ) -> None:
        """Start health check monitoring."""
        async def health_check_loop():
            while True:
                try:
                    healthy = await self.health_checker.check_health(
                        service
                    )
                    if not healthy:
                        await self._handle_unhealthy_service(service)
                except Exception as e:
                    logger.error(
                        f"Health check failed for {service.id}: {e}"
                    )
                await asyncio.sleep(30)  # Check every 30 seconds
                
        asyncio.create_task(health_check_loop())
```

### 20.3 Message Queue System
```python
# Message Queue Implementation
from dataclasses import dataclass
from typing import Any, Callable, List
import asyncio
import json

@dataclass
class Message:
    """Message structure for queue system."""
    
    id: str
    topic: str
    payload: Any
    timestamp: datetime
    metadata: Dict[str, Any]

class MessageQueue:
    """Asynchronous message queue system."""
    
    def __init__(self):
        self.topics: Dict[str, asyncio.Queue] = {}
        self.subscribers: Dict[str, List[Callable]] = {}
        self.persistent_storage = PersistentStorage()
        
    async def publish(
        self,
        topic: str,
        message: Message
    ) -> None:
        """Publish message to topic."""
        if topic not in self.topics:
            self.topics[topic] = asyncio.Queue()
            
        # Store message persistently
        await self.persistent_storage.store_message(message)
        
        # Add to queue
        await self.topics[topic].put(message)
        
        # Notify subscribers
        await self._notify_subscribers(topic, message)
        
    async def subscribe(
        self,
        topic: str,
        callback: Callable
    ) -> None:
        """Subscribe to topic."""
        if topic not in self.subscribers:
            self.subscribers[topic] = []
        self.subscribers[topic].append(callback)
        
    async def _notify_subscribers(
        self,
        topic: str,
        message: Message
    ) -> None:
        """Notify all topic subscribers."""
        subscribers = self.subscribers.get(topic, [])
        
        for subscriber in subscribers:
            try:
                await subscriber(message)
            except Exception as e:
                logger.error(
                    f"Subscriber error for {topic}: {e}"
                )

class AlertQueue(MessageQueue):
    """Specialized queue for alert handling."""
    
    async def publish_alert(
        self,
        alert: Alert
    ) -> None:
        """Publish alert message."""
        message = Message(
            id=str(uuid.uuid4()),
            topic="alerts",
            payload=alert.dict(),
            timestamp=datetime.now(),
            metadata={
                "severity": alert.severity,
                "camera_id": alert.camera_id
            }
        )
        
        await self.publish("alerts", message)
        
    async def process_alerts(self) -> None:
        """Process alerts from queue."""
        while True:
            try:
                message = await self.topics["alerts"].get()
                alert = Alert(**message.payload)
                
                # Process based on severity
                if alert.severity == "critical":
                    await self._handle_critical_alert(alert)
                else:
                    await self._handle_normal_alert(alert)
                    
            except Exception as e:
                logger.error(f"Alert processing error: {e}")
            finally:
                self.topics["alerts"].task_done()
```

### 20.4 Event Bus
```python
# Event Bus Implementation
class EventBus:
    """Central event bus for system communications."""
    
    def __init__(self):
        self.subscribers: Dict[str, List[Callable]] = {}
        self.event_store = EventStore()
        self.retry_policy = RetryPolicy()
        
    async def publish(
        self,
        event_type: str,
        data: Any,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """Publish event to subscribers."""
        event = Event(
            id=str(uuid.uuid4()),
            type=event_type,
            data=data,
            metadata=metadata or {},
            timestamp=datetime.now()
        )
        
        # Store event
        await self.event_store.store_event(event)
        
        # Notify subscribers
        await self._notify_subscribers(event)
        
    async def subscribe(
        self,
        event_type: str,
        handler: Callable,
        filters: Optional[Dict[str, Any]] = None
    ) -> None:
        """Subscribe to event type."""
        subscription = Subscription(
            handler=handler,
            filters=filters
        )
        
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
            
        self.subscribers[event_type].append(subscription)
        
    async def _notify_subscribers(
        self,
        event: Event
    ) -> None:
        """Notify subscribers of event."""
        subscribers = self.subscribers.get(event.type, [])
        
        for subscription in subscribers:
            if self._matches_filters(event, subscription.filters):
                try:
                    await self.retry_policy.execute(
                        subscription.handler,
                        event
                    )
                except Exception as e:
                    await self._handle_delivery_failure(
                        event,
                        subscription,
                        e
                    )
```

[Continue to Part 10: Security Patterns and Protocols...]
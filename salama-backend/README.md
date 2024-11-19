# SALAMA Backend Service

The backend service for the SALAMA railway safety monitoring system, built with FastAPI and PostgreSQL.

## Architecture

### Core Components

- **FastAPI Application**: High-performance web framework
- **PostgreSQL Database**: Persistent data storage
- **SQLAlchemy ORM**: Database interaction layer
- **Pydantic Models**: Data validation and serialization
- **Alembic**: Database migration management

### Project Structure

```
app/
├── api/                    # API endpoints and routing
│   ├── deps.py            # Dependency injection
│   └── v1/                # API version 1
│       ├── api.py         # API router
│       └── endpoints/     # API endpoint modules
├── core/                  # Core application logic
│   └── camera_service.py  # Camera processing service
├── models/                # SQLAlchemy models
├── schemas/               # Pydantic schemas
├── database.py            # Database configuration
└── main.py               # Application entry point
```

## Features

### Core Functionality

- Camera feed management
- Real-time alert processing
- Detection zone configuration
- Data persistence and retrieval
- WebSocket real-time updates

### API Endpoints

#### Camera Management

```
GET     /api/v1/cameras/           # List all cameras
POST    /api/v1/cameras/           # Create new camera
GET     /api/v1/cameras/{id}       # Get camera details
PUT     /api/v1/cameras/{id}       # Update camera
DELETE  /api/v1/cameras/{id}       # Delete camera
```

#### Alert System

```
GET     /api/v1/alerts/            # List all alerts
POST    /api/v1/alerts/            # Create new alert
GET     /api/v1/alerts/{id}        # Get alert details
DELETE  /api/v1/alerts/{id}        # Delete alert
```

#### Detection Zones

```
GET     /api/v1/zones/             # List all zones
POST    /api/v1/zones/             # Create new zone
GET     /api/v1/zones/{id}         # Get zone details
PUT     /api/v1/zones/{id}         # Update zone
DELETE  /api/v1/zones/{id}         # Delete zone
```

## Database Schema

### Camera Model

```python
class Camera(Base):
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    status = Column(String, nullable=False)
    rtsp_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### Alert Model

```python
class Alert(Base):
    id = Column(Integer, primary_key=True)
    camera_id = Column(Integer, ForeignKey("cameras.id"))
    message = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### Detection Zone Model

```python
class DetectionZone(Base):
    id = Column(Integer, primary_key=True)
    camera_id = Column(Integer, ForeignKey("cameras.id"))
    name = Column(String, nullable=False)
    coordinates = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

## Setup and Installation

### Prerequisites

- Python 3.8+
- PostgreSQL 12+
- Virtual environment (recommended)

### Development Setup

1. Create and activate virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:

```bash
# .env file
DATABASE_URL=postgresql://user:password@localhost/salama
SECRET_KEY=your-secret-key
ENVIRONMENT=development
```

4. Initialize database:

```bash
# Create database
createdb salama

# Run migrations
alembic upgrade head
```

5. Start development server:

```bash
uvicorn app.main:app --reload --port 8000
```

## Docker Deployment

1. Build the Docker image:

```bash
docker build -t salama-backend .
```

2. Run with Docker Compose:

```bash
docker-compose up
```

## Development Guidelines

### Code Style

- Follow PEP 8 guidelines
- Use type hints
- Document functions and classes
- Write meaningful variable names

### Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app tests/
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Monitoring and Logging

The application includes:

- Request logging
- Error tracking
- Performance monitoring
- Database query logging

## Security Features

- JWT authentication
- Rate limiting
- CORS configuration
- Input validation
- SQL injection protection

## Contributing

1. Follow Python best practices
2. Include tests for new features
3. Update API documentation
4. Follow git commit conventions
5. Create detailed pull requests

## Additional Resources

- [Main Project Documentation](../README.md)
- [API Documentation](http://localhost:8000/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

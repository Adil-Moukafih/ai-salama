![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)

# SALAMA - Safety Assurance with Live AI Monitoring & Alerts

> ⚠️ **Development Status** ⚠️ : This project is currently under active development and not all features are fully functional yet. We are working on implementing and stabilizing various components of the system.

SALAMA is an advanced railway safety system that leverages cutting-edge AI technologies to transform standard surveillance cameras into intelligent safety monitoring devices. The system combines real-time object detection with contextual understanding to provide proactive safety measures in railway environments.

## Core Objectives

1. **Enhanced Safety Monitoring**

   - Real-time threat detection
   - Proactive alert generation
   - Contextual situation analysis
   - Multi-camera coordination

2. **Operational Efficiency**

   - Automated monitoring
   - Reduced response times
   - Resource optimization
   - Incident prevention

3. **System Intelligence**
   - AI-powered detection
   - Context-aware analysis
   - Learning capabilities
   - Predictive insights

## Key Features

- 🎥 **Real-Time Monitoring**

  - Multi-stream video processing
  - YOLOv5-powered object detection
  - LLaMA integration for context analysis
  - Intelligent threat assessment

- 🚨 **Safety Features**

  - Platform edge monitoring with person detection
  - Track obstruction detection
  - Unauthorized access monitoring
  - Crowd density and flow analysis

- 📊 **System Capabilities**
  - Scalable multi-camera management
  - Instant notification system
  - Performance and incident analysis
  - Context-aware decision support

## System Architecture

#### Frontend (salama-app)

- Framework: Next.js 14
- State Management: Zustand
- Real-time: Socket.io-client
- UI Components: shadcn/ui
- Styling: Tailwind CSS
- Charts: Recharts
- Type Safety: TypeScript

#### Backend (salama-backend)

- Framework: FastAPI
- AI Processing: PyTorch, OpenCV
- Queue System: Celery with Redis
- WebSockets: FastAPI WebSockets
- API Documentation: OpenAPI (Swagger)

#### Database & Storage

- Primary: PostgreSQL 16 + TimescaleDB
- Cache: Redis
- Search: Meilisearch
- Object Storage: MinIO

#### DevOps

- Containerization: Docker
- Orchestration: Kubernetes
- CI/CD: GitHub Actions
- Monitoring: Grafana + Prometheus
- Logging: ELK Stack

## Development Status

The following features are currently under development:

- Real-time camera feed integration
- Alert notification system
- Detection zone processing
- Analytics dashboard
- User authentication system

Please note that some features may be partially implemented or may not work as expected. We recommend checking the project's issues and pull requests for the most up-to-date status of specific features.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- PostgreSQL database
- Docker (optional)

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd salama-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Start the development server:

```bash
npm run dev
```

The frontend will be available at http://localhost:3000

### Backend Setup

1. Navigate to the backend directory:

```bash
cd salama-backend
```

2. Create a virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set up environment variables in `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost/salama
```

5. Start the backend server:

```bash
uvicorn app.main:app --reload
```

The backend API will be available at http://localhost:8000

## Docker Deployment

The project includes Docker support for easy deployment:

1. Build and run using Docker Compose:

```bash
docker-compose up --build
```

This will start both frontend and backend services in containers.

## API Documentation

Once the backend is running, you can access:

- Swagger UI documentation: http://localhost:8000/docs
- ReDoc documentation: http://localhost:8000/redoc

## Project Structure

```
salama/
├── salama-app/               # Frontend application
│   ├── src/
│   │   ├── app/             # Next.js pages and routes
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
│   └── public/             # Static assets
│
└── salama-backend/          # Backend application
    ├── app/
    │   ├── api/            # API endpoints
    │   ├── core/           # Core business logic
    │   ├── models/         # Database models
    │   └── schemas/        # Pydantic schemas
    └── alembic/            # Database migrations
```

## Technical Documentation

Detailed technical documentation is available in the `docs` directory:

- [Technical Documentation](salama-app/docs/)
- [Docker Setup Guide](salama-app/README.Docker.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the Apache License, Version 2.0 - see the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) for details.

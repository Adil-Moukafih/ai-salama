# SALAMA - Railway Safety Monitoring System

> ⚠️ **Development Status**: This project is currently under active development and not all features are fully functional yet. We are working on implementing and stabilizing various components of the system.

SALAMA is a comprehensive railway safety monitoring system that combines real-time camera feeds with intelligent detection zones to ensure railway platform safety. The system consists of a Next.js frontend application for monitoring and management, and a FastAPI backend for handling data processing and storage.

## Features

- 🎥 **Camera Management**

  - Real-time camera feed monitoring
  - Camera status tracking
  - Multiple camera views
  - Detection zone configuration

- 🚨 **Alert System**

  - Real-time safety alerts
  - Severity-based alert classification
  - Alert history and management
  - Instant notifications

- 📊 **Dashboard**

  - Real-time monitoring interface
  - Performance analytics
  - System activity tracking
  - Statistical reporting

- 🔒 **Security**
  - User authentication
  - Role-based access control
  - Secure API communication

## Development Status

The following features are currently under development:

- Real-time camera feed integration
- Alert notification system
- Detection zone processing
- Analytics dashboard
- User authentication system

Please note that some features may be partially implemented or may not work as expected. We recommend checking the project's issues and pull requests for the most up-to-date status of specific features.

## Architecture

### Frontend (salama-app)

- Next.js 15.0
- React 19
- TypeScript
- TailwindCSS
- Chart.js for analytics
- WebSocket integration for real-time updates

### Backend (salama-backend)

- FastAPI
- PostgreSQL database
- SQLAlchemy ORM
- Pydantic for data validation
- RESTful API architecture

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

## Development

### Frontend Development

- Built with Next.js and TypeScript
- Uses TailwindCSS for styling
- Implements real-time updates via WebSocket
- Includes comprehensive component testing

### Backend Development

- RESTful API built with FastAPI
- PostgreSQL database with SQLAlchemy ORM
- Includes database migrations using Alembic
- Comprehensive API documentation with OpenAPI

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

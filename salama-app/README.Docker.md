# Salama App Docker Guide

This guide explains how to run the Salama App using Docker.

## Quick Start with GitHub Container Registry

The application is automatically built and published to GitHub Container Registry. To run it:

```bash
docker pull ghcr.io/your-github-username/salama-app:latest
docker run -d -p 3001:3000 ghcr.io/your-github-username/salama-app:latest
```

The application will be available at `http://localhost:3001`

## Free Deployment Options

### 1. Railway

[Railway](https://railway.app) offers a free tier for Docker containers:

1. Sign up for Railway
2. Create a new project
3. Choose "Deploy from GitHub Container Registry"
4. Enter the container URL: `ghcr.io/your-github-username/salama-app:latest`
5. Railway will automatically deploy and provide a public URL

### 2. Fly.io

[Fly.io](https://fly.io) offers a generous free tier:

1. Install the flyctl CLI
2. Login: `flyctl auth login`
3. Deploy: `flyctl launch --image ghcr.io/your-github-username/salama-app:latest`

### 3. Render

[Render](https://render.com) offers free container hosting:

1. Sign up for Render
2. Create a new "Web Service"
3. Choose "Deploy an existing image"
4. Enter: `ghcr.io/your-github-username/salama-app:latest`

## Using Docker Compose Locally

Create a `compose.yaml` file:

```yaml
services:
  web:
    image: ghcr.io/your-github-username/salama-app:latest
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Then run:

```bash
docker compose up -d
```

## Building From Source

If you want to build the image yourself:

1. Clone the repository
2. Navigate to the project directory
3. Build and run using Docker Compose:

```bash
docker compose up --build
```

## Environment Variables

- `NODE_ENV`: Set to 'production' by default
- `NEXT_TELEMETRY_DISABLED`: Disabled by default

## Ports

The application runs on port 3000 inside the container and is mapped to port 3001 on the host by default.

## Continuous Integration

The project includes GitHub Actions workflows that automatically:

1. Build the Docker image
2. Push it to GitHub Container Registry
3. Tag it with the git commit SHA and 'latest'

## Health Check

The container includes a health check that monitors the application's status every 30 seconds.

## Notes

- The application runs as a non-root user for security
- The container is configured to restart automatically unless stopped manually
- Static assets are properly served from the `.next` directory
- The container image is automatically updated with each push to the main branch

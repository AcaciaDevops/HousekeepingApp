# Docker Setup for PMS App (Expo Web)

This project includes Docker configuration for running the Expo web version of the PMS App.

## Files Created

- **Dockerfile** - Multi-stage Dockerfile with development and production targets
- **Dockerfile.dev** - Simplified development Dockerfile
- **docker-compose.yml** - Docker Compose configuration for easy orchestration
- **.dockerignore** - Exclude unnecessary files from Docker build context

## Quick Start

### Option 1: Development with Docker Compose (Recommended)

```bash
# Build and start the development server
docker-compose up

# The app will be available at http://localhost:19006
```

### Option 2: Development with Docker (Manual)

```bash
# Build the development image
docker build -f Dockerfile.dev -t pms-app-web-dev .

# Run the container
docker run -it \
  -p 19006:19006 \
  -p 19007:19007 \
  -p 5555:5555 \
  -v $(pwd):/app \
  -v /app/node_modules \
  pms-app-web-dev
```

### Option 3: Production Build

```bash
# Build the production image
docker build -f Dockerfile --target production -t pms-app-web-prod .

# Run the production container
docker run -p 8085:8085 pms-app-web-prod

# The app will be available at http://localhost:8085
```

If you want the container logs to show your manager's URL, run it with `APP_URL`:

```bash
docker run -p 8085:8085 -e APP_URL=http://172.26.64.1:8085 pms-app-web-prod
```

## Available Ports

- **19006** - Expo web development server
- **19007** - WebSocket for dev tools
- **5555** - React Native Debugger
- **8085** - Production server

## Environment Variables

You can pass environment variables to Docker:

```bash
docker run -e NODE_ENV=development -e API_URL=http://your-api pms-app-web-dev
```

Or in docker-compose.yml, add them under the `environment` section.

## Rebuilding After Changes

```bash
# Rebuild without cache (includes fresh npm install)
docker-compose build --no-cache

# Rebuild only the development service
docker-compose build pms-web-dev
```

## Stopping Containers

```bash
# Stop all services
docker-compose down

# Remove volumes as well
docker-compose down -v
```

## Troubleshooting

### Port Already in Use
If port 19006 is already in use:

```bash
# Map to a different port
docker run -p 19006:19006 pms-app-web-dev
```

Edit docker-compose.yml:
```yaml
ports:
  - "19008:19006"  # Host:Container port mapping
```

### Module Installation Issues
If you see npm package errors:

```bash
# Rebuild without cache
docker-compose build --no-cache pms-web-dev
docker-compose up
```

### Hot Reload Not Working
Make sure volume mounting is correct in docker-compose.yml. The app code should auto-reload when files change locally.

## Push To Docker Hub

Use your Docker Hub username in place of `<dockerhub-username>`.

```bash
# 1. Log in to Docker Hub
docker login

# 2. Build the production image with a Docker Hub tag
docker build -f Dockerfile --target production -t <dockerhub-username>/pms-app:latest .

# 3. Push the image
docker push <dockerhub-username>/pms-app:latest
```

If you want a versioned tag as well:

```bash
docker tag <dockerhub-username>/pms-app:latest <dockerhub-username>/pms-app:v1
docker push <dockerhub-username>/pms-app:v1
```

## Notes

- The development image uses volume mounting, so code changes will trigger hot reload
- The production image exports the Expo web app to static files and serves them with `serve`
- The production container listens on `0.0.0.0:8085`, but it can print a custom browser URL with `APP_URL`
- Node.js Alpine (node:20-alpine) is used for a smaller image size (~160MB vs ~300MB)

## Building Custom Images

To build with a custom tag:

```bash
docker build -f Dockerfile.dev -t my-company/pms-app:latest .
```

To push to Docker Hub or registry:

```bash
docker push my-company/pms-app:latest
```

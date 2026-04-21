# Multi-stage Dockerfile for Expo Web Application

FROM node:20-alpine AS dependencies

WORKDIR /app

# Copy package files first for better layer caching.
COPY package*.json ./

# Install dependencies with legacy peer deps to match the local project setup.
RUN npm install --legacy-peer-deps

FROM node:20-alpine AS development

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

EXPOSE 19006 19007 5555

ENV EXPO_DEBUG=false \
    PATH=/app/node_modules/.bin:$PATH

CMD ["expo", "start", "--web", "--host", "0.0.0.0", "--port", "19006", "--clear"]

FROM node:20-alpine AS builder

WORKDIR /app

ENV CI=true \
    PATH=/app/node_modules/.bin:$PATH

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Export a static web build into /app/dist.
RUN npm run build:web

FROM node:20-alpine AS production

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist
COPY start-production.sh ./start-production.sh
RUN chmod +x ./start-production.sh

EXPOSE 8085

CMD ["./start-production.sh"]

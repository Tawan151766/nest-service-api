# Deployment Guide

This guide covers different deployment strategies for the Todo Service API.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Production Build](#local-production-build)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Health Checks](#health-checks)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database
- Docker (for containerized deployment)

## Local Production Build

### 1. Install Dependencies
```bash
npm ci --only=production
```

### 2. Build the Application
```bash
npm run build
```

### 3. Set Environment Variables
```bash
export NODE_ENV=production
export DB_HOST=your-db-host
export DB_PORT=5432
export DB_USERNAME=your-username
export DB_PASSWORD=your-password
export DB_NAME=your-database
export JWT_SECRET=your-jwt-secret
export PORT=3000
```

### 4. Start the Application
```bash
npm run start:prod
```

## Docker Deployment

### Option 1: Docker Compose (Recommended for Development)

Create a production docker-compose file:

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USERNAME=postgres
      - DB_PASSWORD=your-secure-password
      - DB_NAME=todo_db
      - JWT_SECRET=your-production-jwt-secret
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your-secure-password
      POSTGRES_DB: todo_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

Deploy with:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Standalone Docker Container

1. **Create Dockerfile:**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
```

2. **Build and Run:**
```bash
# Build image
docker build -t todo-api .

# Run container
docker run -d \
  --name todo-api \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=your-db-host \
  -e DB_PORT=5432 \
  -e DB_USERNAME=your-username \
  -e DB_PASSWORD=your-password \
  -e DB_NAME=your-database \
  -e JWT_SECRET=your-jwt-secret \
  todo-api
```

## Cloud Deployment

### AWS Deployment

#### Using AWS Elastic Beanstalk

1. **Install EB CLI:**
```bash
pip install awsebcli
```

2. **Initialize Elastic Beanstalk:**
```bash
eb init
```

3. **Create Environment:**
```bash
eb create production
```

4. **Set Environment Variables:**
```bash
eb setenv \
  NODE_ENV=production \
  DB_HOST=your-rds-endpoint \
  DB_PORT=5432 \
  DB_USERNAME=your-username \
  DB_PASSWORD=your-password \
  DB_NAME=your-database \
  JWT_SECRET=your-jwt-secret
```

5. **Deploy:**
```bash
eb deploy
```

#### Using AWS ECS

1. **Create Task Definition:**
```json
{
  "family": "todo-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "todo-api",
      "image": "your-account.dkr.ecr.region.amazonaws.com/todo-api:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "DB_HOST", "value": "your-rds-endpoint"},
        {"name": "DB_PORT", "value": "5432"},
        {"name": "JWT_SECRET", "value": "your-jwt-secret"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/todo-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Google Cloud Platform

#### Using Cloud Run

1. **Build and Push to Container Registry:**
```bash
# Build image
docker build -t gcr.io/your-project/todo-api .

# Push to registry
docker push gcr.io/your-project/todo-api
```

2. **Deploy to Cloud Run:**
```bash
gcloud run deploy todo-api \
  --image gcr.io/your-project/todo-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,DB_HOST=your-db-host,JWT_SECRET=your-secret
```

### Heroku Deployment

1. **Install Heroku CLI and login:**
```bash
heroku login
```

2. **Create Heroku app:**
```bash
heroku create your-todo-api
```

3. **Add PostgreSQL addon:**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

4. **Set environment variables:**
```bash
heroku config:set \
  NODE_ENV=production \
  JWT_SECRET=your-jwt-secret
```

5. **Deploy:**
```bash
git push heroku main
```

## Environment Configuration

### Production Environment Variables

Create a `.env.production` file or set system environment variables:

```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=your-production-username
DB_PASSWORD=your-super-secure-password
DB_NAME=todo_production
JWT_SECRET=your-ultra-secure-production-jwt-secret
JWT_EXPIRES_IN=24h
PORT=3000
```

### Security Considerations

1. **JWT Secret:**
   - Use a cryptographically secure random string
   - Minimum 64 characters
   - Different for each environment

2. **Database:**
   - Use strong passwords
   - Enable SSL connections
   - Limit connection pool size
   - Regular security updates

3. **Environment Variables:**
   - Never commit secrets to version control
   - Use secrets management services in production
   - Rotate secrets regularly

## Health Checks

Add health check endpoints to your application:

```typescript
// app.controller.ts
@Get('health')
healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  };
}

@Get('health/db')
async dbHealthCheck() {
  try {
    await this.dataSource.query('SELECT 1');
    return { status: 'ok', database: 'connected' };
  } catch (error) {
    throw new HttpException('Database unavailable', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
```

## Monitoring

### Basic Monitoring

1. **Application Logs:**
```typescript
// main.ts
import { Logger } from '@nestjs/common';

const logger = new Logger('Application');
logger.log(`Application is running on port ${port}`);
```

2. **Error Tracking:**
```bash
npm install @sentry/node
```

3. **Performance Monitoring:**
```bash
npm install @nestjs/terminus
```

### Advanced Monitoring

- Use APM tools like New Relic, DataDog, or AWS X-Ray
- Set up log aggregation with ELK stack or CloudWatch
- Monitor database performance and connections
- Set up alerts for error rates and response times

## Load Balancing

### Nginx Configuration

```nginx
upstream todo_api {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://todo_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL/TLS Configuration

### Using Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Database Migration

### Production Database Setup

1. **Create database:**
```sql
CREATE DATABASE todo_production;
CREATE USER todo_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE todo_production TO todo_user;
```

2. **Run migrations:**
```bash
npm run migration:run
```

## Backup Strategy

### Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h $DB_HOST -U $DB_USERNAME $DB_NAME > backup_$DATE.sql
# Upload to S3 or your preferred storage
```

## Troubleshooting

### Common Issues

1. **Application won't start:**
   - Check environment variables
   - Verify database connectivity
   - Review application logs

2. **Database connection errors:**
   - Verify database credentials
   - Check network connectivity
   - Ensure database is running

3. **JWT errors:**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Ensure consistent secret across instances

4. **Performance issues:**
   - Check database query performance
   - Monitor memory usage
   - Review connection pool settings

### Debug Commands

```bash
# Check application status
pm2 status
docker ps
kubectl get pods

# View logs
pm2 logs
docker logs container-name
kubectl logs pod-name

# Database connectivity test
psql -h $DB_HOST -U $DB_USERNAME -d $DB_NAME -c "SELECT 1;"
```

## Rollback Strategy

1. **Application rollback:**
```bash
# Using PM2
pm2 reload ecosystem.config.js

# Using Docker
docker-compose down
docker-compose up -d

# Using Kubernetes
kubectl rollout undo deployment/todo-api
```

2. **Database rollback:**
```bash
# Restore from backup
psql -h $DB_HOST -U $DB_USERNAME $DB_NAME < backup_file.sql
```

This deployment guide provides comprehensive instructions for deploying the Todo Service API in various environments. Choose the deployment strategy that best fits your infrastructure and requirements.

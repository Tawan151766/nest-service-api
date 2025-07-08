# Environment Configuration

This document describes the environment variables used in the Todo Service API.

## Required Environment Variables

### Database Configuration
| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `DB_HOST` | Database host | `localhost` | `localhost` |
| `DB_PORT` | Database port | `5432` | `5434` |
| `DB_USERNAME` | Database username | `postgres` | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` | `your-secure-password` |
| `DB_NAME` | Database name | `todo_db` | `todo_production` |

### JWT Configuration
| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `JWT_SECRET` | Secret key for JWT signing | None (required) | `your-super-secret-jwt-key` |
| `JWT_EXPIRES_IN` | Token expiration time | `1d` | `7d`, `24h`, `3600` |

### Server Configuration
| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `PORT` | Server port | `3000` | `8080` |
| `NODE_ENV` | Environment mode | `development` | `production` |

## Environment Files

### Development (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=todo_db

# JWT Configuration
JWT_SECRET=your-development-jwt-secret
JWT_EXPIRES_IN=1d

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Production (.env.production)
```env
# Database Configuration
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=your-production-username
DB_PASSWORD=your-super-secure-password
DB_NAME=todo_production

# JWT Configuration
JWT_SECRET=your-ultra-secure-production-jwt-secret
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=production
```

### Testing (.env.test)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=todo_test

# JWT Configuration
JWT_SECRET=test-jwt-secret
JWT_EXPIRES_IN=1h

# Server Configuration
PORT=3001
NODE_ENV=test
```

## Security Best Practices

### JWT Secret
- Use a strong, random secret key (minimum 32 characters)
- Different secrets for different environments
- Never commit secrets to version control
- Rotate secrets regularly in production

### Database Credentials
- Use strong passwords
- Different credentials for different environments
- Limit database user permissions
- Use connection pooling in production

### Example Strong JWT Secret Generation
```bash
# Generate a random 64-character secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Docker Compose Environment

The `docker-compose.yml` file includes environment variables for the PostgreSQL container:

```yaml
environment:
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres
  POSTGRES_DB: todo_db
```

Make sure your application environment variables match these database settings.

## Environment Variable Loading

The application uses `@nestjs/config` to load environment variables:

1. Variables are loaded from `.env` file
2. System environment variables override `.env` values
3. Configuration is validated at startup
4. Invalid configuration prevents application startup

## Validation

Environment variables are validated using the configuration service. Missing required variables will cause the application to fail at startup with clear error messages.

## Examples by Environment

### Local Development
```bash
npm run start:dev
```
Uses `.env` file with local database and development settings.

### Production Deployment
```bash
export DB_HOST=prod-db.example.com
export DB_PASSWORD=ultra-secure-password
export JWT_SECRET=production-jwt-secret
npm run start:prod
```
Uses system environment variables for security.

### Docker Development
```bash
docker-compose up -d  # Starts PostgreSQL
npm run start:dev     # Connects to Docker database
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`
   - Ensure database is running
   - Verify network connectivity

2. **JWT Errors**
   - Ensure `JWT_SECRET` is set
   - Check token expiration with `JWT_EXPIRES_IN`
   - Verify secret consistency across restarts

3. **Port Already in Use**
   - Change `PORT` environment variable
   - Check for other applications using the port
   - Kill existing processes if necessary

### Debug Commands

```bash
# Check environment variables
npm run start:dev -- --debug

# Test database connection
npm run test:e2e

# View all environment variables
printenv | grep -E '^(DB_|JWT_|PORT)'
```

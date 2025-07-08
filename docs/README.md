# Documentation Index

Welcome to the Todo Service API documentation. This directory contains comprehensive documentation for developers, operators, and users of the API.

## 📚 Documentation Files

### [API.md](./API.md)
Complete API reference documentation including:
- All endpoints with request/response examples
- Authentication requirements
- Data Transfer Objects (DTOs)
- Error codes and status responses
- Rate limiting and CORS information

### [DEVELOPMENT.md](./DEVELOPMENT.md)
Comprehensive guide for developers including:
- Development environment setup
- Project structure and architecture
- Coding standards and conventions
- Testing guidelines and examples
- Database development practices
- Performance optimization tips

### [DEPLOYMENT.md](./DEPLOYMENT.md)
Production deployment guide covering:
- Local production builds
- Docker containerization
- Cloud deployment strategies (AWS, GCP, Heroku)
- Environment configuration
- Health checks and monitoring
- Load balancing and SSL setup

### [ENVIRONMENT.md](./ENVIRONMENT.md)
Environment configuration reference including:
- Required and optional environment variables
- Configuration examples for different environments
- Security best practices
- Troubleshooting common configuration issues

## 🚀 Quick Start

1. **For Users**: Start with [API.md](./API.md) to understand available endpoints
2. **For Developers**: Begin with [DEVELOPMENT.md](./DEVELOPMENT.md) for setup and coding guidelines
3. **For DevOps**: Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
4. **For Configuration**: Reference [ENVIRONMENT.md](./ENVIRONMENT.md) for environment setup

## 📋 Main Project README

The main project README is located at the root level: [../README.md](../README.md)

## 🔗 Additional Resources

### Project Structure
```
nest-service-api/
├── src/                    # Source code
│   ├── auth/              # Authentication module
│   ├── todo/              # Todo management module
│   ├── users/             # User management module
│   └── config/            # Configuration files
├── test/                  # End-to-end tests
├── docs/                  # Documentation (this directory)
├── docker-compose.yml     # Local development database
└── package.json          # Project dependencies
```

### Key Technologies
- **Framework**: NestJS 11.x
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT tokens
- **Testing**: Jest framework
- **API Documentation**: OpenAPI/Swagger (planned)

### Getting Help

If you need assistance:

1. **Setup Issues**: Check [DEVELOPMENT.md](./DEVELOPMENT.md) troubleshooting section
2. **API Questions**: Refer to [API.md](./API.md) for endpoint details
3. **Deployment Problems**: See [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting
4. **Environment Configuration**: Check [ENVIRONMENT.md](./ENVIRONMENT.md)

## 🔄 Documentation Updates

This documentation is maintained alongside the codebase. When making changes to the API:

1. Update relevant documentation files
2. Ensure examples remain accurate
3. Update version information if applicable
4. Review all affected documentation sections

## 📝 Contributing to Documentation

When contributing to this project:

1. Update documentation for any API changes
2. Add examples for new features
3. Follow the established documentation format
4. Test all code examples before committing

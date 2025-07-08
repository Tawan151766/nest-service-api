# Todo Service API

A RESTful API built with NestJS for managing todo tasks with user authentication and role-based access control.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access (Admin/Employee)
- **User Management**: Complete CRUD operations for user accounts
- **Todo Management**: Create, read, update, and delete todo tasks
- **Database Integration**: PostgreSQL database with TypeORM
- **Security**: Password hashing with bcrypt, JWT token validation
- **CORS Support**: Configured for frontend integration
- **Testing**: Unit and E2E testing setup with Jest

## 🛠 Tech Stack

- **Framework**: NestJS 11.x
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker & Docker Compose (for database)
- PostgreSQL (if running without Docker)
## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd nest-service-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the database
```bash
docker-compose up -d
```

### 4. Configure environment variables
Create a `.env` file in the root directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=todo_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1d

# Server Configuration
PORT=3000
```

### 5. Run the application
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Admin",
    "lastName": "User",
    "role": "admin"
  },
  "expiresIn": 86400
}
```

### User Management Endpoints

All user endpoints require authentication (JWT token in Authorization header):
```http
Authorization: Bearer <your-jwt-token>
```

#### Create User
```http
POST /users
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "name": "John",
  "lastName": "Doe",
  "role": "employee"
}
```

#### Get All Users
```http
GET /users
```

#### Get User by ID
```http
GET /users/:id
```

#### Update User
```http
PATCH /users/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "lastName": "Updated LastName"
}
```

#### Delete User
```http
DELETE /users/:id
```

### Todo Management Endpoints

All todo endpoints require authentication:

#### Get All Todos
```http
GET /todo
```

#### Get My Todos
```http
GET /todo/me
```

#### Create Todo
```http
POST /todo
Content-Type: application/json

{
  "title": "Complete project documentation",
  "descriptions": "Write comprehensive README and API docs",
  "priority": "high",
  "urgency": "urgent",
  "userId": 1
}
```

#### Update Todo
```http
PATCH /todo/update/:id
Content-Type: application/json

{
  "title": "Updated title",
  "descriptions": "Updated description",
  "priority": "medium"
}
```

#### Update Todo Status
```http
PATCH /todo/status/:id
Content-Type: application/json

{
  "completed": true
}
```

#### Delete Todo
```http
DELETE /todo/:id
```

## 🗄️ Database Schema

### User Entity
```typescript
{
  id: number;           // Primary key
  name: string;         // User's first name
  lastName: string;     // User's last name
  username: string;     // Unique username
  password: string;     // Hashed password
  role: 'admin' | 'employee';  // User role
  todos: Todo[];        // One-to-many relationship
}
```

### Todo Entity
```typescript
{
  id: number;           // Primary key
  title: string;        // Todo title
  descriptions: string; // Todo description
  completed: boolean;   // Completion status
  priority: 'low' | 'medium' | 'high';     // Priority level
  urgency: 'normal' | 'urgent';            // Urgency level
  userId: number;       // Foreign key to User
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Last update timestamp
}
```

## 🧪 Testing

### Run unit tests
```bash
npm run test
```

### Run E2E tests
```bash
npm run test:e2e
```

### Run test coverage
```bash
npm run test:cov
```

## 🔧 Development

### Project Structure
```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt-auth.guard.ts
│   └── jwt.strategy.ts
├── config/              # Configuration files
│   └── database.config.ts
├── todo/                # Todo module
│   ├── dto/            # Data Transfer Objects
│   ├── entities/       # TypeORM entities
│   ├── todo.controller.ts
│   └── todo.service.ts
├── users/              # Users module
│   ├── dto/
│   ├── entities/
│   ├── users.controller.ts
│   └── users.service.ts
├── app.module.ts       # Root module
└── main.ts            # Application entry point
```

### Available Scripts
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with ESLint

## 🐳 Docker

### Start PostgreSQL database
```bash
docker-compose up -d
```

### Stop database
```bash
docker-compose down
```

### View database logs
```bash
docker-compose logs postgres
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: All passwords are hashed using bcrypt
- **Role-based Access**: Admin and Employee role distinctions
- **CORS Configuration**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data stored in environment variables

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=your-db-username
DB_PASSWORD=your-secure-password
DB_NAME=your-production-db
JWT_SECRET=your-super-secure-jwt-secret
PORT=3000
```

### Build for Production
```bash
npm run build
npm run start:prod
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

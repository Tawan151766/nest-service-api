# API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow a consistent format:

### Success Response
```json
{
  "data": {...},
  "message": "Success message",
  "statusCode": 200
}
```

### Error Response
```json
{
  "message": "Error message",
  "error": "Error type",
  "statusCode": 400
}
```

## Authentication Endpoints

### POST /auth/login
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

**Status Codes:**
- `200` - Success
- `401` - Invalid credentials
- `404` - User not found

## User Management Endpoints

### POST /users
Create a new user account.

**Request Body:**
```json
{
  "username": "newuser",
  "password": "password123",
  "name": "John",
  "lastName": "Doe",
  "role": "employee"
}
```

**Response:**
```json
{
  "id": 2,
  "username": "newuser",
  "name": "John",
  "lastName": "Doe",
  "role": "employee"
}
```

**Status Codes:**
- `201` - User created successfully
- `400` - Invalid request data
- `409` - Username already exists

### GET /users
Get all users.

**Response:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "name": "Admin",
    "lastName": "User",
    "role": "admin"
  },
  {
    "id": 2,
    "username": "employee1",
    "name": "John",
    "lastName": "Doe",
    "role": "employee"
  }
]
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

### GET /users/:id
Get a specific user by ID.

**Parameters:**
- `id` (number) - User ID

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "name": "Admin",
  "lastName": "User",
  "role": "admin"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - User not found

### PATCH /users/:id
Update user information.

**Parameters:**
- `id` (number) - User ID

**Request Body:**
```json
{
  "name": "Updated Name",
  "lastName": "Updated LastName"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "name": "Updated Name",
  "lastName": "Updated LastName",
  "role": "admin"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - User not found

### DELETE /users/:id
Delete a user.

**Parameters:**
- `id` (number) - User ID

**Status Codes:**
- `204` - User deleted successfully
- `401` - Unauthorized
- `404` - User not found

## Todo Management Endpoints

### GET /todo
Get all todos.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "descriptions": "Write comprehensive README and API docs",
    "completed": false,
    "priority": "high",
    "urgency": "urgent",
    "userId": 1,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

### GET /todo/me
Get todos for the authenticated user.

**Response:**
```json
[
  {
    "id": 1,
    "title": "My todo task",
    "descriptions": "Task description",
    "completed": false,
    "priority": "medium",
    "urgency": "normal",
    "userId": 1,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

### POST /todo
Create a new todo.

**Request Body:**
```json
{
  "title": "New todo task",
  "descriptions": "Task description",
  "priority": "medium",
  "urgency": "normal",
  "userId": 1
}
```

**Response:**
```json
{
  "id": 2,
  "title": "New todo task",
  "descriptions": "Task description",
  "completed": false,
  "priority": "medium",
  "urgency": "normal",
  "userId": 1,
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

**Status Codes:**
- `201` - Todo created successfully
- `400` - Invalid request data
- `401` - Unauthorized

### PATCH /todo/update/:id
Update a todo.

**Parameters:**
- `id` (number) - Todo ID

**Request Body:**
```json
{
  "title": "Updated title",
  "descriptions": "Updated description",
  "priority": "high"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Updated title",
  "descriptions": "Updated description",
  "completed": false,
  "priority": "high",
  "urgency": "normal",
  "userId": 1,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:15:00Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request data
- `401` - Unauthorized
- `404` - Todo not found

### PATCH /todo/status/:id
Update todo completion status.

**Parameters:**
- `id` (number) - Todo ID

**Request Body:**
```json
{
  "completed": true
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Task title",
  "descriptions": "Task description",
  "completed": true,
  "priority": "medium",
  "urgency": "normal",
  "userId": 1,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:20:00Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request data
- `401` - Unauthorized
- `404` - Todo not found

### DELETE /todo/:id
Delete a todo.

**Parameters:**
- `id` (number) - Todo ID

**Status Codes:**
- `204` - Todo deleted successfully
- `401` - Unauthorized
- `404` - Todo not found

## Data Transfer Objects (DTOs)

### CreateUserDto
```typescript
{
  username: string;     // Required, unique
  password: string;     // Required, min 6 characters
  name?: string;        // Optional
  lastName?: string;    // Optional
  role: 'admin' | 'employee'; // Required
}
```

### UpdateUserDto
```typescript
{
  name?: string;        // Optional
  lastName?: string;    // Optional
  role?: 'admin' | 'employee'; // Optional
}
```

### CreateTodoDto
```typescript
{
  title: string;        // Required
  descriptions?: string; // Optional
  priority: 'low' | 'medium' | 'high'; // Required
  urgency: 'normal' | 'urgent';        // Required
  userId: number;       // Required
}
```

### UpdateTodoDto
```typescript
{
  title?: string;       // Optional
  descriptions?: string; // Optional
  priority?: 'low' | 'medium' | 'high'; // Optional
  urgency?: 'normal' | 'urgent';        // Optional
}
```

### UpdateStatusDto
```typescript
{
  completed: boolean;   // Required
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Resource deleted successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Invalid or missing authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

## Rate Limiting
Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## CORS
The API is configured to accept requests from:
- `http://localhost:3000`

Additional origins can be configured in the main.ts file.

# Development Guide

This guide provides detailed information for developers working on the Todo Service API.

## Table of Contents
1. [Development Setup](#development-setup)
2. [Project Structure](#project-structure)
3. [Coding Standards](#coding-standards)
4. [Testing](#testing)
5. [Database Development](#database-development)
6. [API Development](#api-development)
7. [Authentication & Authorization](#authentication--authorization)
8. [Error Handling](#error-handling)
9. [Logging](#logging)
10. [Performance Optimization](#performance-optimization)

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker & Docker Compose
- PostgreSQL client (optional)
- VS Code (recommended) with extensions:
  - NestJS Snippets
  - TypeScript Importer
  - Prettier
  - ESLint

### Initial Setup

1. **Clone and Install:**
```bash
git clone <repository-url>
cd nest-service-api
npm install
```

2. **Start Database:**
```bash
docker-compose up -d
```

3. **Environment Setup:**
```bash
cp .env.example .env
# Edit .env with your settings
```

4. **Start Development Server:**
```bash
npm run start:dev
```

### Development Scripts

```bash
# Development
npm run start:dev      # Start with hot reload
npm run start:debug    # Start with debugging

# Building
npm run build          # Build for production
npm run start:prod     # Start production build

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix linting issues
npm run format         # Format with Prettier

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests
```

## Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── auth.controller.ts   # Authentication endpoints
│   ├── auth.service.ts      # Authentication business logic
│   ├── auth.module.ts       # Module definition
│   ├── jwt-auth.guard.ts    # JWT authentication guard
│   ├── jwt.strategy.ts      # JWT strategy implementation
│   └── *.spec.ts           # Unit tests
├── config/                  # Configuration files
│   └── database.config.ts   # Database configuration
├── todo/                    # Todo management module
│   ├── dto/                # Data Transfer Objects
│   │   ├── create-todo.dto.ts
│   │   ├── update-todo.dto.ts
│   │   └── update-status.dto.ts
│   ├── entities/           # Database entities
│   │   └── todo.entity.ts
│   ├── todo.controller.ts  # Todo endpoints
│   ├── todo.service.ts     # Todo business logic
│   ├── todo.module.ts      # Module definition
│   └── *.spec.ts          # Unit tests
├── users/                  # User management module
│   ├── dto/               # Data Transfer Objects
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   └── user-response.dto.ts
│   ├── entities/          # Database entities
│   │   └── user.entity.ts
│   ├── users.controller.ts # User endpoints
│   ├── users.service.ts    # User business logic
│   ├── users.module.ts     # Module definition
│   └── *.spec.ts          # Unit tests
├── app.module.ts           # Root application module
├── app.controller.ts       # Root controller
├── app.service.ts          # Root service
└── main.ts                # Application entry point

test/                       # End-to-end tests
├── app.e2e-spec.ts
└── jest-e2e.json

docs/                       # Documentation
├── API.md
├── DEPLOYMENT.md
├── ENVIRONMENT.md
└── DEVELOPMENT.md
```

## Coding Standards

### TypeScript Guidelines

1. **Use TypeScript strictly:**
```typescript
// Good
interface User {
  id: number;
  username: string;
  role: UserRole;
}

// Bad
interface User {
  id: any;
  username: any;
  role: any;
}
```

2. **Use proper typing for DTOs:**
```typescript
// create-user.dto.ts
import { IsString, IsEnum, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(['admin', 'employee'])
  role: UserRole;
}
```

3. **Use proper error handling:**
```typescript
// Good
async findUser(id: number): Promise<User> {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }
  return user;
}
```

### Naming Conventions

- **Files:** `kebab-case.type.ts` (e.g., `user.controller.ts`)
- **Classes:** `PascalCase` (e.g., `UserController`)
- **Methods/Variables:** `camelCase` (e.g., `findUser`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `JWT_SECRET`)
- **Interfaces:** `PascalCase` with optional 'I' prefix
- **Enums:** `PascalCase` (e.g., `UserRole`)

### Module Structure

Each module should follow this pattern:

```typescript
// module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Entity])],
  controllers: [Controller],
  providers: [Service],
  exports: [Service], // Export if used by other modules
})
export class ModuleName {}
```

## Testing

### Unit Testing

Create unit tests for each service and controller:

```typescript
// user.service.spec.ts
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = { id: 1, username: 'test' } as User;
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      expect(await service.findOne(1)).toBe(user);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
```

### E2E Testing

Test complete user flows:

```typescript
// app.e2e-spec.ts
describe('TodoController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'password' })
      .expect(200);

    authToken = loginResponse.body.accessToken;
  });

  it('/todo (POST)', () => {
    return request(app.getHttpServer())
      .post('/todo')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Todo',
        descriptions: 'Test Description',
        priority: 'medium',
        urgency: 'normal',
        userId: 1,
      })
      .expect(201);
  });
});
```

### Test Coverage Goals

- **Unit Tests:** 80%+ coverage
- **Integration Tests:** All critical paths
- **E2E Tests:** All user flows

## Database Development

### Entity Guidelines

```typescript
// user.entity.ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', default: 'employee' })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
```

### Migration Best Practices

1. **Always create migrations for schema changes:**
```bash
npm run migration:generate -- -n AddUserRole
```

2. **Review migrations before running:**
```typescript
// migration file
export class AddUserRole1640995200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('user', new TableColumn({
      name: 'role',
      type: 'varchar',
      default: "'employee'",
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'role');
  }
}
```

3. **Test migrations in development first**

### Query Optimization

```typescript
// Good - Use proper relations
async findUserWithTodos(id: number): Promise<User> {
  return this.userRepository.findOne({
    where: { id },
    relations: ['todos'],
  });
}

// Good - Use query builder for complex queries
async findTodosByPriority(priority: Priority): Promise<Todo[]> {
  return this.todoRepository
    .createQueryBuilder('todo')
    .leftJoinAndSelect('todo.user', 'user')
    .where('todo.priority = :priority', { priority })
    .orderBy('todo.createdAt', 'DESC')
    .getMany();
}
```

## API Development

### Controller Guidelines

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
```

### Service Guidelines

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'name', 'lastName', 'role'], // Exclude password
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'name', 'lastName', 'role'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }
}
```

## Authentication & Authorization

### JWT Strategy

```typescript
// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
```

### Role-based Authorization

```typescript
// roles.decorator.ts
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}

// Usage in controller
@Get('admin-only')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
adminOnlyEndpoint() {
  return { message: 'Admin access granted' };
}
```

## Error Handling

### Custom Exception Filters

```typescript
// http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}

// Apply globally in main.ts
app.useGlobalFilters(new HttpExceptionFilter());
```

### Validation Pipes

```typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           // Strip unknown properties
    forbidNonWhitelisted: true, // Throw error for unknown properties
    transform: true,           // Transform input to DTO instance
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

## Logging

### Setup Winston Logger

```typescript
// logger.service.ts
@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, error?: Error, context?: string) {
    this.logger.error(message, { error: error?.stack, context });
  }
}
```

## Performance Optimization

### Database Optimization

1. **Use pagination:**
```typescript
async findAll(page = 1, limit = 10): Promise<[Todo[], number]> {
  return this.todoRepository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
    order: { createdAt: 'DESC' },
  });
}
```

2. **Use proper indexing:**
```typescript
@Entity()
@Index(['userId', 'completed']) // Composite index
export class Todo {
  @Column()
  @Index() // Single column index
  userId: number;

  @Column()
  completed: boolean;
}
```

3. **Use query optimization:**
```typescript
// Avoid N+1 queries
const users = await this.userRepository.find({
  relations: ['todos'],
});
```

### Caching

```typescript
// Install cache manager
npm install cache-manager

// Setup Redis cache
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
})
export class AppModule {}

// Use caching in service
@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @CacheKey('users')
  @CacheTTL(300) // 5 minutes
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
```

## Git Workflow

### Commit Message Convention

```
type(scope): description

feat(auth): add JWT refresh token functionality
fix(todo): resolve status update bug
docs(api): update endpoint documentation
test(user): add unit tests for user service
refactor(db): optimize query performance
```

### Branch Strategy

- `main` - Production ready code
- `develop` - Integration branch
- `feature/feature-name` - Feature development
- `hotfix/fix-name` - Production hotfixes

### Pre-commit Hooks

```bash
# Install husky
npm install --save-dev husky

# Setup pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run test"
```

This development guide provides comprehensive information for working on the Todo Service API. Follow these guidelines to maintain code quality and consistency across the project.

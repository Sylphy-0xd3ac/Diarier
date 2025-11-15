# Development Guide

## Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- MongoDB 6.0+ (running locally or accessible remotely)
- Yarn 4.10.3 (managed via Corepack)

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd secure-diary-api

# Install Corepack (if not already enabled)
corepack enable

# Install dependencies
yarn install

# Create .env file from template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

## Development Workflow

### Starting Development Server

```bash
# Start with hot reload
yarn dev

# Server will start at http://localhost:3000
# Changes to source files will trigger automatic reload
```

### Building for Production

```bash
# Build TypeScript
yarn build

# Output goes to dist/
# Run built version
yarn start
```

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Generate coverage report
yarn test:coverage
```

## Project Structure

```
src/
├── core/                    # MVC Framework
│   ├── Application.ts       # Main app class
│   ├── Controller/          # Base controller
│   ├── Model/               # Base model
│   ├── Router/              # Express router wrapper
│   ├── Middleware/          # Built-in middleware
│   ├── Database/            # MongoDB connection
│   └── Utils/               # Utility functions
├── app/                     # Application code
│   ├── controllers/         # API controllers
│   ├── models/              # Data models
│   ├── config/              # Configuration
│   └── routes.ts            # Route definitions
├── types/                   # TypeScript types
└── index.ts                 # Entry point
```

## Code Style

### TypeScript Configuration

- Target: ES2020
- Module: CommonJS
- Strict mode: Enabled
- esModuleInterop: Enabled

### Naming Conventions

- **Classes**: PascalCase (e.g., `AuthController`, `EntryModel`)
- **Functions**: camelCase (e.g., `getUser`, `validateInput`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_PASSWORD_LENGTH`)
- **Variables**: camelCase (e.g., `userData`, `isAuthenticated`)
- **Files**: PascalCase for classes, camelCase for utilities

### Import Organization

1. External dependencies
2. Core modules
3. App modules
4. Types

```typescript
import express from 'express';
import { BaseController } from '../../core/Controller/BaseController';
import { Entry } from '../models/Entry';
import { ApiResponse } from '../../types';
```

## Adding Features

### Adding a New API Endpoint

1. **Create Model** (if needed):

```typescript
// src/app/models/User.ts
import { Document, Schema } from 'mongoose';
import { BaseModel } from '../../core/Model/BaseModel';

export interface IUser extends Document {
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
  },
  { timestamps: true }
);

export class User extends BaseModel<IUser> {
  constructor() {
    super('users', userSchema);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }
}
```

2. **Create Controller**:

```typescript
// src/app/controllers/UserController.ts
import { BaseController } from '../../core/Controller/BaseController';
import { User } from '../models/User';

export class UserController extends BaseController {
  private userModel = new User();

  async getUser() {
    try {
      if (!this.ctx) throw new Error('Context not set');

      const { id } = this.ctx.req.params;

      // Validation
      if (!id) {
        const response = this.error('User ID is required', 400);
        this.send(response);
        return;
      }

      // Business logic
      const user = await this.userModel.findById(id);

      if (!user) {
        const response = this.error('User not found', 404);
        this.send(response);
        return;
      }

      // Success response
      const response = this.success(user, 'User retrieved successfully');
      this.send(response);
    } catch (error) {
      console.error('Error fetching user:', error);
      const response = this.error('Failed to fetch user');
      this.send(response);
    }
  }
}
```

3. **Register Route**:

```typescript
// In src/app/routes.ts
import { UserController } from './controllers/UserController';

export function registerRoutes(app: Express, config: AppConfig): void {
  const userController = new UserController();

  app.get(
    '/api/v1/users/:id',
    auth,
    createHandler(userController.getUser, userController)
  );
}
```

## Utility Functions

### PasswordUtils

```typescript
import { PasswordUtils } from '../core/Utils';

// Hash password
const hashedPassword = await PasswordUtils.hash('mypassword');

// Compare password
const isValid = await PasswordUtils.compare('mypassword', hashedPassword);
```

### JwtUtils

```typescript
import { JwtUtils } from '../core/Utils';
import config from './config';

// Create token
const token = JwtUtils.sign(
  { userId: 123, email: 'user@example.com' },
  config.jwt.secret,
  config.jwt.expiresIn
);

// Verify token
const decoded = JwtUtils.verify(token, config.jwt.secret);

// Decode without verification
const payload = JwtUtils.decode(token);
```

### UuidUtils

```typescript
import { UuidUtils } from '../core/Utils';

// Generate UUID
const id = UuidUtils.generate();

// Validate UUID
const isValid = UuidUtils.isValid('550e8400-e29b-41d4-a716-446655440000');
```

## Database Operations

### BaseModel Methods

All models inherit these methods from `BaseModel<T>`:

```typescript
// Create
const entry = await entryModel.create({ title, content });

// Find by ID
const entry = await entryModel.findById('mongodb-id');

// Find all with filter
const entries = await entryModel.findAll({ userId: 123 });

// Find one
const entry = await entryModel.findOne({ id: 'uuid' });

// Update by ID
const updated = await entryModel.updateById('mongodb-id', { title: 'new' });

// Delete by ID
const deleted = await entryModel.deleteById('mongodb-id');

// Count documents
const count = await entryModel.count({ userId: 123 });
```

## Middleware

### Built-in Middleware

```typescript
// CORS middleware
import { corsMiddleware } from './core/Middleware';
app.use(corsMiddleware());

// Logger middleware
import { loggerMiddleware } from './core/Middleware';
app.use(loggerMiddleware());

// Auth middleware
import { authMiddleware } from './core/Middleware';
app.use('/api/v1/entries', authMiddleware(config));

// Error handler
import { errorHandler } from './core/Middleware';
app.use(errorHandler());
```

### Creating Custom Middleware

```typescript
import { Request, Response, NextFunction } from 'express';

export function customMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Do something
    next();
  };
}
```

## Error Handling

### Response Format

Success:
```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation completed"
}
```

Error:
```json
{
  "status": "error",
  "message": "Error description",
  "code": 400
}
```

### Status Codes

- `200`: OK
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Debugging

### Enable Debug Logging

```bash
DEBUG=secure-diary-api:* yarn dev
```

### Using VS Code Debugger

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/node_modules/.bin/tsx",
      "args": ["watch", "src/index.ts"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## Testing

### Test Structure

```typescript
// src/__tests__/AuthController.test.ts
import { AuthController } from '../app/controllers/AuthController';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(() => {
    controller = new AuthController();
  });

  it('should initialize application with password', async () => {
    // Test implementation
  });
});
```

### Running Specific Tests

```bash
# Run single test file
yarn test AuthController.test.ts

# Run tests matching pattern
yarn test --testNamePattern="should initialize"
```

## Dependency Updates

### Check for Updates

```bash
# Check available updates
yarn upgrade-interactive

# Check security vulnerabilities
yarn audit
```

### Update Dependencies

```bash
# Update specific package
yarn upgrade package-name

# Update all dependencies
yarn upgrade-interactive
```

## Git Workflow

### Branch Naming

- Feature: `feature/description`
- Bug fix: `bugfix/description`
- Documentation: `docs/description`

### Commit Messages

Follow conventional commits:

```
type(scope): subject

body

footer
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(auth): add two-factor authentication

Implement TOTP-based 2FA for improved security.

Closes #123
```

## Production Deployment

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Dependencies up to date
- [ ] Security audit passed

### Deployment Steps

1. Build the application: `yarn build`
2. Start production server: `yarn start`
3. Verify endpoints responding
4. Monitor error logs
5. Setup monitoring/alerts

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check MongoDB running
mongosh

# Test connection in app
DEBUG=mongoose:* yarn dev
```

### Port Already in Use

```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules yarn.lock
yarn install
```

### TypeScript Errors

```bash
# Check TypeScript
yarn build

# Run type checking
npx tsc --noEmit
```

## Resources

- [Express Documentation](https://expressjs.com/)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JWT Introduction](https://jwt.io/introduction)
- [Argon2 Documentation](https://github.com/ranisalt/node-argon2)

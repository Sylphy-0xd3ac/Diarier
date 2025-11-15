# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-14

### Added

#### Core Framework
- Custom MVC framework built from scratch
- Modular application architecture
- Type-safe controller base class
- Generic model base class with CRUD operations
- Express router wrapper for flexible routing
- Comprehensive middleware system

#### Features
- User authentication with JWT tokens
- Password security using Argon2id hashing
- Password-protected application initialization
- Diary entry management (CRUD operations)
- Application status and health check endpoints
- Entry listing, creation, reading, updating, and deletion

#### API Endpoints
- `GET /health` - Health check
- `GET /api/v1/status` - Application status
- `POST /api/v1/init` - Initialize application
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/entries` - List all entries (protected)
- `POST /api/v1/entries` - Create new entry (protected)
- `GET /api/v1/entries/:id` - Get single entry (protected)
- `PUT /api/v1/entries/:id` - Update entry (protected)
- `DELETE /api/v1/entries/:id` - Delete entry (protected)

#### Security
- JWT-based authentication with configurable expiration
- Argon2id password hashing with optimized parameters:
  - Memory cost: 64 MB
  - Time cost: 3 iterations
  - Parallelism: 4 threads
- Client-side encryption support
- Input validation and type checking
- CORS middleware with configurable origins
- Error handling middleware with sensitive data masking
- Request logging middleware

#### Database
- MongoDB integration with Mongoose
- Connection pooling and retry logic
- Schema validation
- Automatic timestamps on models
- Database initialization and disconnection handling

#### Configuration
- Environment-based configuration system
- Dotenv support for environment variables
- Configurable port, database URI, JWT secret, and token expiration
- Application mode support (development/production)

#### Development Tools
- TypeScript with strict mode enabled
- Jest testing framework configured
- Development server with hot reload (tsx)
- Build system with TypeScript compilation
- Yarn 4.10.3 package manager with Corepack support

#### Documentation
- Comprehensive README with API documentation
- Development guide for contributors
- Security policy and best practices
- Project structure documentation
- Code examples and patterns

### Technical Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.3
- **HTTP Framework**: Express.js 4.18
- **Database**: MongoDB 7.7 with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken 9.0)
- **Password Hashing**: Argon2id (argon2 0.31)
- **UUID Generation**: uuid 9.0
- **Package Manager**: Yarn 4.10.3
- **Dev Tools**: tsx 4.7, Jest 29.7, ts-jest 29.1

### Project Files

- TypeScript configuration (`tsconfig.json`)
- Jest configuration (`jest.config.js`)
- Yarn configuration (`.yarnrc.yml`)
- Environment variables template (`.env.example`)
- Comprehensive .gitignore
- Multiple documentation files

### Notes

- All encryption/decryption for diary content is handled on the client side
- Server stores only encrypted data
- Master password is stored using Argon2id hashing
- Application can only be initialized once
- JWT tokens required for entry management endpoints

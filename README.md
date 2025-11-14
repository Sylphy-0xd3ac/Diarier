# Secure Diary API

A secure diary API system with custom MVC framework implementation and MongoDB integration. All encryption/decryption is handled on the client side, while the server stores and provides access to encrypted data.

## 📋 Features

- ✅ Custom MVC Framework built from scratch
- ✅ RESTful API for diary entry management
- ✅ JWT-based authentication
- ✅ Password-protected access
- ✅ MongoDB database integration
- ✅ TypeScript support
- ✅ Full type safety
- ✅ Error handling middleware
- ✅ CORS support
- ✅ Request logging

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.x
- **Database**: MongoDB 6.0+ with Mongoose
- **HTTP Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Dev Server**: tsx with hot reload
- **Package Manager**: Yarn

## 📁 Project Structure

```
src/
├── core/                      # MVC Framework Core
│   ├── Application.ts         # Main application class
│   ├── Controller/            # Base controller class
│   │   └── BaseController.ts
│   ├── Model/                 # Base model class
│   │   └── BaseModel.ts
│   ├── Router/                # Routing system
│   │   └── Router.ts
│   ├── Middleware/            # Built-in middleware
│   │   └── index.ts
│   ├── Database/              # Database abstraction
│   │   └── index.ts
│   └── Utils/                 # Utility functions
│       └── index.ts
├── app/                       # Application Code
│   ├── controllers/           # API Controllers
│   │   ├── AuthController.ts
│   │   ├── EntryController.ts
│   │   └── StatusController.ts
│   ├── models/                # Data Models
│   │   ├── Config.ts
│   │   └── Entry.ts
│   ├── config/                # Configuration
│   │   └── index.ts
│   └── routes.ts              # Route definitions
├── types/                     # TypeScript type definitions
│   └── index.ts
└── index.ts                   # Application entry point
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6.0+ running locally or connection string
- Yarn package manager

### Installation

```bash
# Install dependencies
yarn install

# Copy environment template
cp .env.example .env

# Edit .env if needed (default uses local MongoDB)
```

### Development

```bash
# Start development server with hot reload
yarn dev

# Server will be available at http://localhost:3000
```

### Production

```bash
# Build project
yarn build

# Start production server
yarn start
```

### Testing

```bash
# Run tests
yarn test

# Run tests with coverage
yarn test:coverage
```

## 📡 API Endpoints

### Health Check
```
GET /health
```
Response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-14T14:30:00.000Z",
  "database": "connected"
}
```

### Application Status
```
GET /api/v1/status
```
Response:
```json
{
  "status": "initialized" | "uninitialized",
  "server": "running",
  "timestamp": "2025-11-14T14:30:00.000Z"
}
```

### Initialize Application
```
POST /api/v1/init
```
Request:
```json
{
  "password": "secure_password"
}
```
Response:
```json
{
  "status": "success",
  "message": "Application initialized successfully"
}
```

### Login
```
POST /api/v1/auth/login
```
Request:
```json
{
  "password": "secure_password"
}
```
Response:
```json
{
  "status": "success",
  "data": {
    "token": "jwt_token",
    "expiresIn": 3600
  }
}
```

### Get All Entries
```
GET /api/v1/entries
Headers: Authorization: Bearer <token>
```
Response:
```json
{
  "status": "success",
  "data": {
    "entries": [
      {
        "_id": "mongodb_id",
        "id": "uuid",
        "title": "encrypted_title",
        "cipherText": "encrypted_content",
        "createdAt": "2025-11-14T14:30:00.000Z",
        "updatedAt": "2025-11-14T14:30:00.000Z"
      }
    ]
  }
}
```

### Create Entry
```
POST /api/v1/entries
Headers: Authorization: Bearer <token>
```
Request:
```json
{
  "title": "encrypted_title",
  "cipherText": "encrypted_content"
}
```
Response:
```json
{
  "status": "success",
  "data": {
    "id": "generated_uuid"
  }
}
```

### Get Single Entry
```
GET /api/v1/entries/:id
Headers: Authorization: Bearer <token>
```

### Update Entry
```
PUT /api/v1/entries/:id
Headers: Authorization: Bearer <token>
```
Request:
```json
{
  "title": "updated_encrypted_title",
  "cipherText": "updated_encrypted_content"
}
```

### Delete Entry
```
DELETE /api/v1/entries/:id
Headers: Authorization: Bearer <token>
```

## 🔐 Security Features

1. **Authentication**: JWT-based token authentication
2. **Password Security**: bcrypt hashing with 10 salt rounds
3. **Client-side Encryption**: All encryption/decryption happens on client
4. **CORS**: Configurable cross-origin resource sharing
5. **Input Validation**: Type checking and validation for all inputs
6. **Error Handling**: Centralized error handling with sensitive data masking
7. **Database**: MongoDB with Mongoose for data validation
8. **Token Expiration**: Configurable JWT token expiration time

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Required
NODE_ENV=development                                    # Environment (development/production)
MONGODB_URI=mongodb://localhost:27017/diary            # MongoDB connection URI

# Optional
PORT=3000                                              # Server port
JWT_SECRET=your-secret-key-change-in-production       # JWT signing secret
JWT_EXPIRES_IN=1h                                      # JWT expiration time
```

## 📚 Development Workflow

### Adding a New Feature

1. **Create Model** (if needed):
   ```typescript
   // src/app/models/MyModel.ts
   export class MyModel extends BaseModel<IMyInterface> {
     constructor() {
       super('myCollection', mySchema);
     }
   }
   ```

2. **Create Controller**:
   ```typescript
   // src/app/controllers/MyController.ts
   export class MyController extends BaseController {
     async myMethod() {
       // Implementation
     }
   }
   ```

3. **Register Routes**:
   ```typescript
   // In src/app/routes.ts
   app.get('/api/v1/my-route', createHandler(myController.myMethod, myController));
   ```

### TypeScript Utilities

- **PasswordUtils**: Password hashing and comparison
- **JwtUtils**: JWT token signing and verification
- **UuidUtils**: UUID generation and validation
- **BaseController**: Common response formatting
- **BaseModel**: Database CRUD operations

## 🧪 Testing

The project uses Jest for testing. Test files should follow the naming convention:
- `*.test.ts`
- `*.spec.ts`

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test --watch

# Generate coverage report
yarn test:coverage
```

## 📝 Code Style

- **Language**: TypeScript with strict mode enabled
- **Linting**: ESLint recommended but not enforced
- **Formatting**: Prettier recommended but not enforced
- **Naming**: camelCase for variables/functions, PascalCase for classes/types

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection URI in `.env`
- Verify firewall/network settings

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill process using the port: `lsof -i :3000`

### JWT Token Expired
- Request a new token from `/api/v1/auth/login`
- Check `JWT_EXPIRES_IN` configuration

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

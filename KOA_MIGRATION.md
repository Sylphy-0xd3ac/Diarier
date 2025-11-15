# Express to Koa Migration Guide

This document describes the migration from Express.js to Koa framework in the Secure Diary API project.

## Overview

The project has been successfully migrated from Express.js to Koa.js framework. This provides:
- Simpler middleware composition with async/await
- More lightweight and flexible architecture
- Better context handling with unified Koa Context object
- Improved error handling with try/catch pattern

## Key Changes

### 1. Framework Dependencies

**Before (Express):**
```json
"express": "^4.18.2",
"@types/express": "^4.17.21"
```

**After (Koa):**
```json
"koa": "^2.15.0",
"@koa/cors": "^5.0.0",
"@koa/router": "^12.0.1",
"koa-body": "^6.0.1",
"@types/koa": "^2.15.0",
"@types/koa__cors": "^3.0.4",
"@types/koa__router": "^12.0.0"
```

### 2. Application Structure

**Express Application:**
```typescript
import express from 'express';
const app = express();
app.use(middleware);
app.get('/path', handler);
```

**Koa Application:**
```typescript
import Koa from 'koa';
import Router from '@koa/router';
const app = new Koa();
const router = new Router();
app.use(middleware);
router.get('/path', handler);
app.use(router.routes());
```

### 3. Context API Changes

**Express Request/Response:**
```typescript
// In Express handlers
req.body          // Request body
req.params        // URL parameters
req.headers       // Headers
res.status(200)   // Set status
res.json(data)    // Send JSON
```

**Koa Context:**
```typescript
// In Koa handlers (unified context)
ctx.request.body  // Request body
ctx.params        // URL parameters
ctx.headers       // Headers
ctx.status = 200  // Set status
ctx.body = data   // Set response body
```

### 4. Controller Implementation

**Express Controller:**
```typescript
async init() {
  const { password } = this.ctx.req.body;
  this.ctx.res.status(200).json(response);
}
```

**Koa Controller:**
```typescript
async init() {
  const { password } = this.ctx.request.body;
  this.ctx.status = 200;
  this.ctx.body = response;
}
```

### 5. Middleware Pattern

**Express Middleware:**
```typescript
export function authMiddleware(config) {
  return (req, res, next) => {
    // Handle request
    next(); // Continue to next middleware
  };
}
```

**Koa Middleware:**
```typescript
export function authMiddleware(config): Middleware {
  return async (ctx: Context, next) => {
    // Handle request
    await next(); // Continue to next middleware
  };
}
```

### 6. Error Handling

**Express Error Handler:**
```typescript
export function errorHandler() {
  return (err, req, res, next) => {
    res.status(500).json({ error: err.message });
  };
}
```

**Koa Error Handler:**
```typescript
export function errorHandler(): Middleware {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: err.message };
    }
  };
}
```

## File Changes

### Updated Files

1. **package.json**
   - Removed Express dependencies
   - Added Koa and related packages

2. **src/types/index.ts**
   - Changed Context from Express request/response to Koa.Context
   - Simplified type definitions

3. **src/core/Application.ts**
   - Changed from Express to Koa app initialization
   - Updated middleware registration
   - Updated router integration

4. **src/core/Router/Router.ts**
   - Changed from Express Router to Koa Router (@koa/router)
   - Simplified route registration

5. **src/core/Middleware/index.ts**
   - All middleware converted to Koa pattern
   - Async/await based error handling
   - Simplified CORS handling with @koa/cors

6. **src/core/Controller/BaseController.ts**
   - Updated to use ctx.status and ctx.body instead of res.status().json()
   - Simplified response handling

7. **src/app/controllers/*Controller.ts**
   - Updated to use ctx.request.body instead of ctx.req.body
   - Updated to use ctx.params instead of ctx.req.params
   - All controllers now compatible with Koa context

8. **src/app/routes.ts**
   - Changed from Express app.get/post to Router router.get/post
   - Updated route handler pattern

9. **src/index.ts**
   - Complete rewrite for Koa initialization
   - Uses Koa app and Router explicitly
   - Simpler middleware composition

## Benefits of Koa

### 1. Middleware Composition
Koa's middleware system with async/await is more intuitive:
```typescript
// Linear middleware flow
app.use(errorHandler());
app.use(cors());
app.use(logger());
```

### 2. Unified Context
All request/response data in single context object:
```typescript
// Single context parameter
async handler(ctx) {
  ctx.body = ctx.request.body; // Cleaner access
}
```

### 3. Error Handling
Try/catch pattern is more natural:
```typescript
async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // Handle error
  }
}
```

### 4. Lightweight
Koa is more minimal and flexible, allowing easier customization:
```typescript
// Only add what you need
const app = new Koa();
app.use(cors());
app.use(bodyParser());
```

## Testing

All tests continue to pass with Koa:
```bash
yarn test
# Test Suites: 1 passed
# Tests: 8 passed
```

## Running the Application

Development:
```bash
yarn dev
# Starts Koa server with hot reload
```

Production:
```bash
yarn build
yarn start
# Runs compiled Koa application
```

## Backwards Compatibility

The API endpoints remain unchanged:
- All routes work exactly the same
- Response formats are identical
- Authentication and authorization work the same way

## Known Differences

1. **Body Parser**: Using koa-body instead of express.json()
2. **CORS**: Using @koa/cors instead of cors package
3. **Router**: Using @koa/router instead of Express Router
4. **Status Codes**: Set via ctx.status instead of res.status()
5. **Response Body**: Set via ctx.body instead of res.json()

## Migration Checklist

- [x] Update dependencies in package.json
- [x] Update type definitions
- [x] Rewrite Application class
- [x] Update Router implementation
- [x] Convert all middleware
- [x] Update BaseController
- [x] Update all controllers
- [x] Update route registration
- [x] Update index.ts entry point
- [x] Test all endpoints
- [x] Verify tests pass
- [x] Build successfully

## Future Considerations

1. **Performance**: Koa is generally faster than Express
2. **Ecosystem**: Koa has a smaller but growing ecosystem
3. **Scalability**: Better for building microservices
4. **TypeScript**: Better TypeScript support out of the box

## References

- [Koa Official Documentation](https://koajs.com/)
- [@koa/router Documentation](https://github.com/koajs/router)
- [Koa vs Express Comparison](https://github.com/koajs/koa/wiki)

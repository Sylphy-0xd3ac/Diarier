# Molo Diary

A full-stack diary application with client and server components.

## Project Structure

- `client/` - React + TypeScript frontend application using Vite
- `server/` - Koa + TypeScript backend server with MongoDB

## Tech Stack

### Client
- React 19
- TypeScript
- Vite
- Ant Design
- TailwindCSS
- React Markdown

### Server
- Koa 2
- Node.js
- TypeScript
- MongoDB + Mongoose
- Argon2 (for PIN hashing)
- JWT (for authentication)

## Getting Started

### Prerequisites
- Node.js (v20+)
- MongoDB running locally or a connection URI

### Installation

```bash
npm install
```

### Environment Setup

#### Server
Create a `.env` file in the `server/` directory:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/molo-diary
JWT_SECRET=your-secret-key-change-this-in-production
```

#### Client
Create a `.env` file in the `client/` directory:

```
VITE_API_URL=http://localhost:3000/api
```

### Running the Application

#### Development

Start the server:
```bash
npm run dev:server
```

In another terminal, start the client:
```bash
npm run dev:client
```

#### Production

Build both projects:
```bash
npm run build
```

Start the server:
```bash
npm run start:server
```

## API Endpoints

### Authentication
- `GET /api/check-init-status` - Check if system is initialized
- `POST /api/initialize` - Initialize system with PIN
- `POST /api/login` - Login with PIN

### Diaries (requires authentication)
- `GET /api/diaries` - Get all diaries
- `POST /api/diaries` - Create or update a diary
- `DELETE /api/diaries/:id` - Delete a diary

## Features

- PIN-based authentication with Argon2 hashing
- JWT token-based authorization
- Create, read, update, and delete diary entries
- Dark mode support
- Responsive design
- Search functionality
- Markdown support for diary content

## Security Notes

- Change the JWT_SECRET in production
- Use HTTPS in production
- Use a strong MongoDB password
- Implement rate limiting for production deployments

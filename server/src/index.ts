import Koa from 'koa';
import type { Context, Next } from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import diariesRoutes from './routes/diaries.js';

const app = new Koa();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/molo-diary';

// Middleware
app.use(cors());
app.use(bodyParser());

// Routes
app.use(authRoutes.routes()).use(authRoutes.allowedMethods());
app.use(diariesRoutes.routes()).use(diariesRoutes.allowedMethods());

// Connect to MongoDB
async function connect() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Start server
async function start() {
  await connect();
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
  });
}

start().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

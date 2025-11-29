import Router from '@koa/router';
import type { Context } from 'koa';
import { User } from '../models/User.js';
import { hashPin, verifyPin } from '../utils/crypto.js';
import { generateToken } from '../utils/jwt.js';
import { Diary } from '../models/Diary.js';

const router = new Router({ prefix: '/api' });

// Check if system is initialized
router.get('/check-init-status', async (ctx: Context) => {
  try {
    const user = await User.findOne();
    ctx.body = {
      success: true,
      data: {
        initialized: !!user,
      },
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { success: false, error: 'Failed to check init status' };
  }
});

// Initialize system with PIN
router.post('/initialize', async (ctx: Context) => {
  try {
    const { pin } = ctx.request.body as { pin: string };

    if (!pin || typeof pin !== 'string') {
      ctx.status = 400;
      ctx.body = { success: false, error: 'PIN is required' };
      return;
    }

    // Check if already initialized
    const existingUser = await User.findOne();
    if (existingUser) {
      ctx.status = 400;
      ctx.body = { success: false, error: 'System already initialized' };
      return;
    }

    // Hash PIN and create user
    const pinHash = await hashPin(pin);
    const user = new User({ pinHash });
    await user.save();

    ctx.body = { success: true };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { success: false, error: 'Failed to initialize' };
  }
});

// Login with PIN
router.post('/login', async (ctx: Context) => {
  try {
    const { pin } = ctx.request.body as { pin: string };

    if (!pin || typeof pin !== 'string') {
      ctx.status = 400;
      ctx.body = { success: false, error: 'PIN is required' };
      return;
    }

    const user = await User.findOne();
    if (!user) {
      ctx.status = 400;
      ctx.body = { success: false, error: 'System not initialized' };
      return;
    }

    const isValid = await verifyPin(pin, user.pinHash);
    if (!isValid) {
      ctx.status = 401;
      ctx.body = { success: false, error: 'Invalid PIN' };
      return;
    }

    const token = generateToken({ userId: user._id.toString() });
    ctx.body = { success: true, data: { token } };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { success: false, error: 'Failed to login' };
  }
});

export default router;

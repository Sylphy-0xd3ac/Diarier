import type { Context, Next } from 'koa';
import { verifyToken } from '../utils/jwt.ts';

export async function authMiddleware(ctx: Context, next: Next): Promise<void> {
  const token = ctx.headers.authorization?.split(' ')[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = { success: false, error: 'No token provided' };
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    ctx.status = 401;
    ctx.body = { success: false, error: 'Invalid token' };
    return;
  }

  ctx.state.token = token;
  await next();
}

import jwt from 'jsonwebtoken';
import type { Middleware } from 'koa';
import type { AppConfig, Context } from '../../types';

export function errorHandler(): Middleware {
  return async (ctx: Context, next) => {
    try {
      await next();
    } catch (err: any) {
      console.error('Error:', err);

      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal Server Error';

      ctx.status = statusCode;
      ctx.body = {
        status: 'error',
        message,
        code: statusCode,
      };
    }
  };
}

export function authMiddleware(config: AppConfig): Middleware {
  return async (ctx: Context, next) => {
    const token = ctx.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      ctx.status = 401;
      ctx.body = {
        status: 'error',
        message: 'Unauthorized: No token provided',
        code: 401,
      };
      return;
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      ctx.user = decoded;
      await next();
    } catch (_error) {
      ctx.status = 401;
      ctx.body = {
        status: 'error',
        message: 'Unauthorized: Invalid token',
        code: 401,
      };
    }
  };
}

export function loggerMiddleware(): Middleware {
  return async (ctx: Context, next) => {
    const startTime = Date.now();
    await next();
    const duration = Date.now() - startTime;
    console.log(
      `[${new Date().toISOString()}] ${ctx.method} ${ctx.path} - ${ctx.status} (${duration}ms)`,
    );
  };
}

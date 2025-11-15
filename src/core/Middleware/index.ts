import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { AppConfig } from '../../types';

export function errorHandler() {
  return (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
      status: 'error',
      message,
      code: statusCode,
    });
  };
}

export function authMiddleware(config: AppConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: No token provided',
        code: 401,
      });
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      (req as any).user = decoded;
      next();
    } catch (_error) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: Invalid token',
        code: 401,
      });
    }
  };
}

export function loggerMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`,
      );
    });

    next();
  };
}

export function corsMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  };
}

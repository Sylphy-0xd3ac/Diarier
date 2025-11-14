import { Router as ExpressRouter, Request, Response, NextFunction } from 'express';
import { Context, RouteHandler } from '../../types';

export class Router {
  private router: ExpressRouter;
  private routes: Map<string, RouteHandler[]> = new Map();

  constructor() {
    this.router = ExpressRouter();
  }

  register(method: 'get' | 'post' | 'put' | 'delete' | 'patch', path: string, handlers: any[]): void {
    const key = `${method}:${path}`;
    this.routes.set(key, handlers);

    (this.router as any)[method](path, ...handlers);
  }

  getExpressRouter(): ExpressRouter {
    return this.router;
  }

  createContext(req: Request, res: Response, next: NextFunction): Context {
    return {
      req,
      res,
      next,
      user: (req as any).user,
    };
  }
}

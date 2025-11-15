import type KoaRouter from '@koa/router';
import type { RouteHandler } from '../../types';

export class Router {
  private router: KoaRouter;
  private routes: Map<string, RouteHandler[]> = new Map();

  constructor() {
    const KoaRouterClass = require('@koa/router');
    this.router = new KoaRouterClass();
  }

  register(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    path: string,
    handler: any,
  ): void {
    const key = `${method}:${path}`;
    this.routes.set(key, [handler]);

    (this.router as any)[method](path, handler);
  }

  getKoaRouter(): KoaRouter {
    return this.router;
  }
}

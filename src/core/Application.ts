import type Koa from 'koa';
import koaBody from 'koa-body';
import type { Middleware } from 'koa';
import type { AppConfig } from '../types';
import type { BaseController } from './Controller/BaseController';
import { Database } from './Database';
import { Router } from './Router/Router';

export class Application {
  private koa: Koa;
  private server: any = null;
  private router: Router;
  private config: AppConfig;
  private middlewares: Middleware[] = [];

  constructor(config: AppConfig) {
    this.config = config;
    this.koa = new (require('koa'))();
    this.router = new Router();

    this.setupDefaultMiddleware();
  }

  private setupDefaultMiddleware(): void {
    this.koa.use(koaBody());
  }

  use(middleware: Middleware): void {
    this.middlewares.push(middleware);
    this.koa.use(middleware);
  }

  registerControllers(controllers: BaseController[]): void {
    controllers.forEach((controller) => {
      this.registerController(controller);
    });
  }

  private registerController(_controller: BaseController): void {
    // Controllers are registered via routes.ts directly
    // This method is kept for potential future use
  }

  async start(port: number = this.config.port): Promise<void> {
    try {
      await Database.connect(this.config.mongodb);

      this.koa.use(this.router.getKoaRouter().routes());
      this.koa.use(this.router.getKoaRouter().allowedMethods());

      this.server = this.koa.listen(port, () => {
        console.log(`✓ Server running at http://localhost:${port}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  async stop(): Promise<void> {
    if (this.server) {
      await new Promise<void>((resolve) => {
        this.server.close(() => {
          console.log('✓ Server stopped');
          resolve();
        });
      });
    }

    await Database.disconnect();
  }

  getKoa(): Koa {
    return this.koa;
  }
}

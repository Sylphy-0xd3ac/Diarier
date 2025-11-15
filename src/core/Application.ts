import http from 'node:http';
import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import type { AppConfig } from '../types';
import type { BaseController } from './Controller/BaseController';
import { Database } from './Database';
import { Router } from './Router/Router';

export class Application {
  private express: Express;
  private server: http.Server | null = null;
  private router: Router;
  private config: AppConfig;
  private middlewares: Array<(req: Request, res: Response, next: NextFunction) => void> = [];

  constructor(config: AppConfig) {
    this.config = config;
    this.express = express();
    this.router = new Router();

    this.setupDefaultMiddleware();
  }

  private setupDefaultMiddleware(): void {
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
  }

  use(middleware: (req: Request, res: Response, next: NextFunction) => void): void {
    this.middlewares.push(middleware);
    this.express.use(middleware);
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

      this.express.use(this.router.getExpressRouter());

      this.server = http.createServer(this.express);

      await new Promise<void>((resolve) => {
        this.server?.listen(port, () => {
          console.log(`✓ Server running at http://localhost:${port}`);
          resolve();
        });
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  async stop(): Promise<void> {
    if (this.server) {
      await new Promise<void>((resolve) => {
        this.server?.close(() => {
          console.log('✓ Server stopped');
          resolve();
        });
      });
    }

    await Database.disconnect();
  }

  getExpress(): Express {
    return this.express;
  }
}

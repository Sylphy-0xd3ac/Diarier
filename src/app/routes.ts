import { Express, Request, Response, NextFunction } from 'express';
import { AppConfig, Context } from '../types';
import { authMiddleware } from '../core/Middleware';
import { StatusController } from './controllers/StatusController';
import { AuthController } from './controllers/AuthController';
import { EntryController } from './controllers/EntryController';

export function registerRoutes(app: Express, config: AppConfig): void {
  const statusController = new StatusController();
  const authController = new AuthController();
  const entryController = new EntryController();

  // Helper to create context and call controller methods
  const createHandler = (
    controllerMethod: (this: any) => Promise<void> | void,
    controller: any
  ) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const ctx: Context = {
          req,
          res,
          next,
          user: (req as any).user,
        };
        controller.setContext?.(ctx);
        await controllerMethod.call(controller);
      } catch (error) {
        next(error);
      }
    };
  };

  // Status Routes
  app.get('/health', createHandler(statusController.getHealth, statusController));
  app.get('/api/v1/status', createHandler(statusController.getStatus, statusController));

  // Auth Routes
  app.post('/api/v1/init', createHandler(authController.init, authController));
  app.post('/api/v1/auth/login', createHandler(authController.login, authController));

  // Entry Routes (Protected)
  const auth = authMiddleware(config);
  app.get(
    '/api/v1/entries',
    auth,
    createHandler(entryController.getAllEntries, entryController)
  );
  app.post(
    '/api/v1/entries',
    auth,
    createHandler(entryController.createEntry, entryController)
  );
  app.get(
    '/api/v1/entries/:id',
    auth,
    createHandler(entryController.getEntry, entryController)
  );
  app.put(
    '/api/v1/entries/:id',
    auth,
    createHandler(entryController.updateEntry, entryController)
  );
  app.delete(
    '/api/v1/entries/:id',
    auth,
    createHandler(entryController.deleteEntry, entryController)
  );
}

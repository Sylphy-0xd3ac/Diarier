import type Koa from 'koa';
import { authMiddleware } from '../core/Middleware';
import type { AppConfig, Context } from '../types';
import { AuthController } from './controllers/AuthController';
import { EntryController } from './controllers/EntryController';
import { StatusController } from './controllers/StatusController';

export function registerRoutes(router: any, config: AppConfig): void {
  const statusController = new StatusController();
  const authController = new AuthController();
  const entryController = new EntryController();

  // Helper to create context and call controller methods
  const createHandler = (controllerMethod: (this: any) => Promise<void> | void, controller: any) => {
    return async (ctx: Context) => {
      try {
        controller.setContext?.(ctx);
        await controllerMethod.call(controller);
      } catch (error) {
        ctx.throw(500, 'Internal Server Error');
      }
    };
  };

  // Status Routes
  router.get('/health', createHandler(statusController.getHealth, statusController));
  router.get('/api/v1/status', createHandler(statusController.getStatus, statusController));

  // Auth Routes
  router.post('/api/v1/init', createHandler(authController.init, authController));
  router.post('/api/v1/auth/login', createHandler(authController.login, authController));

  // Entry Routes (Protected)
  const auth = authMiddleware(config);
  router.get('/api/v1/entries', auth, createHandler(entryController.getAllEntries, entryController));
  router.post(
    '/api/v1/entries',
    auth,
    createHandler(entryController.createEntry, entryController),
  );
  router.get(
    '/api/v1/entries/:id',
    auth,
    createHandler(entryController.getEntry, entryController),
  );
  router.put(
    '/api/v1/entries/:id',
    auth,
    createHandler(entryController.updateEntry, entryController),
  );
  router.delete(
    '/api/v1/entries/:id',
    auth,
    createHandler(entryController.deleteEntry, entryController),
  );
}

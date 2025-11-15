import cors from '@koa/cors';
import Router from '@koa/router';
import Koa from 'koa';
import config from './app/config';
import { registerRoutes } from './app/routes';
import { Database } from './core/Database';
import { errorHandler, loggerMiddleware } from './core/Middleware';

async function bootstrap() {
  try {
    console.log(`Starting application in ${config.env} mode...`);

    // Initialize database connection
    await Database.connect(config.mongodb);

    // Create Koa app
    const app = new Koa();

    // Register global middleware
    app.use(errorHandler());
    app.use(cors());
    app.use(loggerMiddleware());

    // Create router
    const router = new Router();

    // Register routes
    registerRoutes(router, config);

    // Use router
    app.use(router.routes());
    app.use(router.allowedMethods());

    // Start server
    const server = app.listen(config.port, () => {
      console.log(`✓ Server running at http://localhost:${config.port}`);
      console.log(`✓ Environment: ${config.env}`);
      console.log(`✓ MongoDB: ${config.mongodb.uri}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        console.log('HTTP server closed');
        await Database.disconnect();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(async () => {
        console.log('HTTP server closed');
        await Database.disconnect();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to bootstrap application:', error);
    process.exit(1);
  }
}

bootstrap();

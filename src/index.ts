import express from 'express';
import { Database } from './core/Database';
import config from './app/config';
import { loggerMiddleware, corsMiddleware, errorHandler } from './core/Middleware';
import { registerRoutes } from './app/routes';

async function bootstrap() {
  try {
    console.log(`Starting application in ${config.env} mode...`);

    // Initialize database connection
    await Database.connect(config.mongodb);

    // Create Express app
    const app = express();

    // Register global middleware
    app.use(corsMiddleware());
    app.use(loggerMiddleware());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Register routes
    registerRoutes(app, config);

    // Error handling middleware (must be last)
    app.use(errorHandler());

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

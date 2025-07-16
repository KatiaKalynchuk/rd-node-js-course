import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import pino from 'pino-http';
import { scopePerRequest } from 'awilix-express';
import swaggerUi from 'swagger-ui-express';

import container from './container.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { router as brewsRoutes } from './routes/brews.routes.js';
import { createZodSpec } from './docs/openapi.js';
import { config } from './config/index.js';

export function createApp() {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());
  app.use(compression());

  // Logging
  if (process.env.NODE_ENV === 'production') {
    app.use(pino());
  } else {
    app.use(morgan('dev'));
  }

  // JSON body
  app.use(express.json());

  // Dependency injection
  app.use(scopePerRequest(container));

  // Routes
  app.use('/api', brewsRoutes);

  // Swagger UI
  if (config.env === 'development') {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(createZodSpec()));
    console.log(`Swagger docs → ${config.baseUrl}/docs`);
  }

  app.use(notFound);

  // Global error handler
  app.use(errorHandler);

  return app;
}

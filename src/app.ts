import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errors as validationErrorMiddleware } from 'celebrate';
import logger from './logger.js';
import { pinoHttp } from 'pino-http';
import config from './config/index.js';
import buildRoutes from './routes.js';
import { globalErrorMiddleware, httpErrors } from './errorHandler.js';

const app = express();

/**
 * Middleware registration.
 */
app.use(cors(config.cors));
app.use(helmet());
app.use(express.json());

/**
 * Logging middleware
 */
app.use(pinoHttp({ logger }));

/**
 * Route registration.
 */
buildRoutes(app);

/**
 * 404 handler.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  next(httpErrors.NotFound(`path ${req.path} undefined`));
});

/**
 * Request-validation error middleware
 */
app.use(validationErrorMiddleware());

/**
 * Global error middleware
 */
app.use(globalErrorMiddleware);

export default app;

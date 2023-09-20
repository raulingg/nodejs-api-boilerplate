import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import expressPinoLogger from 'express-pino-logger';
import { errors } from 'celebrate';
import logger from './logger';
import buildRoutes from './routes';
import { globalErrorMiddleware } from './errorHandler';
import { AppError } from './utils';

const app = express();

/**
 * Middleware registration.
 */
app.use(cors());
app.use(helmet());
app.use(express.json());

/**
 * Logging middleware
 */
app.use(expressPinoLogger({ logger }));

/**
 * Route registration.
 */
buildRoutes(app);

/**
 * 404 handler.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError({
      message: `path ${req.path} undefined`,
      statusCode: 404,
    }),
  );
});

/**
 * Request-validation error middleware
 */
app.use(errors());

/**
 * Global error middleware
 */
app.use(globalErrorMiddleware);

export default app;

import HTTP from 'node:http';
import logger from './logger.js';
import { AppError } from './utils/index.js';
import type { NextFunction, Request, Response } from 'express';

const makeError = (statusCode: number) => (message: string) =>
  new AppError({ message, statusCode });

export const errors = {
  NotFound: makeError(404),
};

export const globalErrorMiddleware = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const { message = 'internal server error' } = err;

  const result = {
    error: HTTP.STATUS_CODES[statusCode],
    message,
    statusCode,
  };

  res.status(statusCode).json(result);

  handleError(err);
};

export const handleError = (err: AppError | Error) => {
  if (err instanceof AppError && err.statusCode === 404) return;

  performErrorActions(err);

  // If non-operational then emit SIGINT signal to gracefully shut down the server
  if (!isOperationalError(err)) process.emit('SIGINT');
};

export const isOperationalError = (err: AppError | Error) => {
  return err instanceof AppError ? err.operational : false;
};

export const performErrorActions = (err: AppError | Error) => {
  logger.error(err, 'Error message from the centralized error-handling component');
  // TODO: email admins, send event to an error-tracking system like Sentry,...
};

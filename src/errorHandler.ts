import HTTP from 'node:http';
import logger from './logger';
import { AppError } from './utils';
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
  handleError(err);

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const { message = 'internal server error' } = err;

  const result = {
    error: HTTP.STATUS_CODES[statusCode],
    message,
    statusCode,
  };

  res.status(statusCode).json(result);

  if (!isOperationalError(err)) process.emit('SIGINT');
};

export const isOperationalError = (err: AppError | Error) => {
  return err instanceof AppError ? err.operational : false;
};

// TODO: email admins, send event to an error-tracking system like Sentry,...
export const handleError = (err: AppError | Error) => {
  logger.error(err, 'Error message from the centralized error-handling component');
};

const HTTP = require('http');
const logger = require('./logger');
const { AppError } = require('./utils');

const inProduction = process.env.NODE_ENV === 'production';

const makeError = (statusCode) => (message) => new AppError({ message, statusCode });

module.exports.errors = {
  NotFound: makeError(404),
};

module.exports.isOperationalError = (err) => err.operational === true;

// TODO: email admins, send event to an error-tracking system like Sentry,...
module.exports.handleError = (err) => {
  logger.error(err, 'Error message from the centralized error-handling component');
};

// eslint-disable-next-line no-unused-vars
module.exports.globalErrorMiddleware = (err, req, res, next) => {
  module.exports.handleError(err);

  const operational = module.exports.isOperationalError(err);
  const statusCode = err.statusCode || 500;
  const message = inProduction && statusCode === 500 ? 'Something went wrong!' : err.message;

  const result = {
    statusCode,
    error: HTTP.STATUS_CODES[statusCode],
    message,
  };

  res.status(statusCode).json(result);

  if (!operational) process.emit('SIGINT');
};

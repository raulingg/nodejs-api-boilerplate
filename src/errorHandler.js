const HTTP = require('http');
const logger = require('./logger');
const { AppError } = require('./utils');

const makeError = (statusCode) => (message) =>
  new AppError({ message, statusCode });

module.exports.errors = {
  NotFound: makeError(404),
};

module.exports.isOperationalError = (err) => !!err?.operational;

// TODO: email admins, send event to an error-tracking system like Sentry,...
module.exports.handleError = (err) => {
  logger.error(
    err,
    'Error message from the centralized error-handling component',
  );
};

// eslint-disable-next-line no-unused-vars
module.exports.globalErrorMiddleware = (err, req, res, next) => {
  exports.handleError(err);

  const { message = 'internal server error', statusCode = 500 } = err;

  const result = {
    error: HTTP.STATUS_CODES[statusCode],
    message,
    statusCode,
  };

  res.status(statusCode).json(result);

  if (!exports.isOperationalError(err)) process.emit('SIGINT');
};

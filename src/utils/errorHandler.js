const logger = require('./logger');

const isOperationalError = (err) => err.isOperational === true;

// TODO: email admins, send event to an error-tracking system like Sentry,...
const handleError = (err) => {
  const isOperational = isOperationalError(err);
  logger.error(err, 'Error message from the centralized error-handling component');

  return isOperational;
};

module.exports.errorHandler = {
  handleError,
  isOperationalError,
};

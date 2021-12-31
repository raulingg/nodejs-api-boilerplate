class AppError extends Error {
  constructor({
    statusCode = 500,
    description = 'internal server error',
    isOperational = true,
  } = {}) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

module.exports.AppError = AppError;

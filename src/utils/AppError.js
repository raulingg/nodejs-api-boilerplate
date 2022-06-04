class AppError extends Error {
  constructor({ message = 'Internal server error', statusCode = 500, operational = true } = {}) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.operational = operational;
    Error.captureStackTrace(this);
  }
}

module.exports = AppError;

export class AppError extends Error {
  statusCode: number;
  operational: boolean;
  constructor({ message = 'Internal server error', statusCode = 500, operational = true } = {}) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.operational = operational;
    Error.captureStackTrace(this);
  }
}

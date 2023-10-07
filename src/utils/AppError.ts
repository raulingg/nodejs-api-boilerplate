export type AppErrorParams = {
  name?: string;
  message?: string;
  statusCode?: number;
  operational?: boolean;
};

export class AppError extends Error {
  statusCode: number;
  operational: boolean;
  constructor({
    name = '',
    message = 'Internal server error',
    statusCode = 500,
    operational = true,
  }: AppErrorParams = {}) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.operational = operational;
    Error.captureStackTrace(this);
  }
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const expressPinoLogger = require('express-pino-logger');
const { errors } = require('celebrate');
const { logger, errorHandler } = require('./utils');

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
require('./routes')(app);

/**
 * 404 handler.
 */
app.use((req, res) => {
  res.statusCode = 404;
  res.send('Not Found!');
});

/**
 * Request-validation error middleware
 */
app.use(errors());

/**
 * Global error middleware
 */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const isOperational = errorHandler.handleError(err);
  const inProduction = process.env.NODE_ENV === 'production';
  const status = isOperational ? err.statusCode : 500;
  const message = inProduction && status === 500 ? 'Something went wrong!' : err.message;

  res.status(status).json({ message });

  if (!isOperational) process.emit('SIGINT');
});

module.exports = app;

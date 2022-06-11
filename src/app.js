const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const expressPinoLogger = require('express-pino-logger');
const { errors } = require('celebrate');
const logger = require('./logger');
const { globalErrorMiddleware } = require('./errorHandler');
const { AppError } = require('./utils');

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
app.use((req, res, next) => {
  next(
    new AppError({ message: `path ${req.path} undefined`, statusCode: 404 }),
  );
});

/**
 * Request-validation error middleware
 */
app.use(errors());

/**
 * Global error middleware
 */
app.use(globalErrorMiddleware);

module.exports = app;

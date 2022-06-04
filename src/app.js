const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const expressPinoLogger = require('express-pino-logger');
const { errors } = require('celebrate');
const logger = require('./logger');
const { globalErrorMiddleware } = require('./errorHandler');

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
app.use(globalErrorMiddleware);

module.exports = app;

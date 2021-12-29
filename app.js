const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const expressPinoLogger = require('express-pino-logger');
const logger = require('./services/loggerService');

/**
 * app instance initialization.
 */
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
  req.log.info('404 code');
  res.statusCode = 404;
  res.send('Not Found!');
});

module.exports = app;

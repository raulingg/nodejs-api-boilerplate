const cors = require('cors');
const helmet = require('helmet');
const express = require('express');

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

module.exports = app;

const pino = require('pino');
const config = require('./config');

const customLevels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

const destStrategiesByEnv = {
  development: {
    dest: config.logger.dest,
    minLength: 4096,
    sync: true,
    mkdir: true,
  },
  production: 1,
  test: '/dev/null',
};

const destination = destStrategiesByEnv[config.app.env];

// TODO: Log Routing 🤔
// link: https://github.com/pinojs/pino/blob/master/docs/api.md#options
module.exports = pino(
  {
    enabled: config.logger.enabled,
    customLevels,
    useOnlyCustomLevels: true,
    level: 'http',
  },
  pino.destination(destination),
);

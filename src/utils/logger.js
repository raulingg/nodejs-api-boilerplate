const pino = require('pino');
const config = require('../config');

const customLevels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};
// TODO: Log Routing 🤔
module.exports = pino(
  // link: https://github.com/pinojs/pino/blob/master/docs/api.md#options
  {
    enabled: config.logger.enabled,
    customLevels,
    useOnlyCustomLevels: true,
    level: 'http',
  },
);

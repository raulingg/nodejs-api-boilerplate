const pino = require('pino');

const customLevels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};
// TODO: Log Routing 🤔
module.exports.logger = pino(
  // link: https://github.com/pinojs/pino/blob/master/docs/api.md#options
  {
    customLevels,
    useOnlyCustomLevels: true,
    level: 'http',
  },
);

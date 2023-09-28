const dockerCompose = require('docker-compose');
const mongoose = require('mongoose');

const { env } = process;

const isCI = !!(
  env.CI || // Travis CI, CircleCI, Cirrus CI, Gitlab CI, Appveyor, CodeShip, Github Actions
  env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
  env.BUILD_NUMBER || // Jenkins, TeamCity
  false
);

module.exports = async () => {
  if (isCI) {
    // ️️️✅ Best Practice: Leave the DB up in dev environment
    await dockerCompose.down();
  } else {
    // ✅ Best Practice: Clean the database occasionally
    // eslint-disable-next-line no-lonely-if
    if (Math.ceil(Math.random() * 10) === 10) {
      const { default: config } = await import('./config.js');
      await mongoose.connect(config.db.uri, config.db.options);
      await mongoose.connection.db.dropDatabase();
    }
  }
};

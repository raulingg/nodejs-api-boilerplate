const { default: mongoose } = require('mongoose');

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
    await globalThis.__ENVIRONMENT__.stop();
  } else {
    // ✅ Best Practice: Clean the database occasionally
    // eslint-disable-next-line no-lonely-if
    if (Math.ceil(Math.random() * 10) === 10) {
      await mongoose.connection.db.dropDatabase();
    }
  }
};

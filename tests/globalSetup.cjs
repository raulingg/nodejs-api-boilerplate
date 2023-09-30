const dockerCompose = require('docker-compose');
const mongoose = require('mongoose');

module.exports = async () => {
  console.time('globalSetup');

  // ️️️✅ Best Practice: Speed up during development, if already live then do nothing
  if (!(await isDBReachable())) {
    console.log('Starting DB container');
    // ️️️✅ Best Practice: Start the infrastructure within a test hook - No failures occur because the DB is down
    try {
      await dockerCompose.upOne('mongo', {
        cwd: process.cwd(),
        log: true,
      });
      // 👍🏼 We're ready
    } catch (error) {
      throw new Error('An error ocurred while starting the DB container', error);
    }
  }

  console.timeEnd('globalSetup');
};

async function isDBReachable() {
  if (mongoose.connection.readyState === 1) return true;

  try {
    const { default: config } = await import('./config.js');
    await mongoose.connect(config.db.uri, config.db.options);
    return true;
  } catch (error) {
    return false;
  }
}

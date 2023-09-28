const path = require('path');
const dockerCompose = require('docker-compose');
const mongoose = require('mongoose');

module.exports = async () => {
  console.time('globalSetup');

  // ️️️✅ Best Practice: Speed up during development, if already live then do nothing
  if (!(await isDBReachable())) {
    console.log('Starting DB container');
    // ️️️✅ Best Practice: Start the infrastructure within a test hook - No failures occur because the DB is down
    await dockerCompose.upAll({
      cwd: path.join(__dirname),
      log: true,
      // commandOptions: ['-f', 'docker-compose.test.yml'],
    });
    // 👍🏼 We're ready
  }

  console.timeEnd('globalSetup');
};

async function isDBReachable() {
  if (mongoose.connection.readyState === 1) return true;

  try {
    const { default: config } = await import('./config.js');
    await mongoose.connect(config.db.uri, config.db.options);
    console.log('DB is reachable');
    return true;
  } catch (error) {
    console.log('DB is unreachable');
    return false;
  }
}

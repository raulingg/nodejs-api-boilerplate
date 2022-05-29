const path = require('path');
const dockerCompose = require('docker-compose');
const isPortReachable = require('is-port-reachable');

module.exports = async () => {
  console.time('globalSetup');

  // ️️️✅ Best Practice: Speed up during development, if already live then do nothing
  const isDBReachable = await isPortReachable(27018);

  if (!isDBReachable) {
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

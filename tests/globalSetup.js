const path = require('path');
const { DockerComposeEnvironment, Wait } = require('testcontainers');

module.exports = async () => {
  console.time('globalSetup');

  // ️️️✅ Best Practice: Start the infrastructure within a test hook - No failures occur because the DB is down
  const composeFile = 'docker-compose.test.yml';
  const composeFilePath = path.resolve(__dirname, '..');
  const environment = await new DockerComposeEnvironment(composeFilePath, composeFile)
    .withExposedPorts(27017)
    .withWaitStrategy('mongo_1', Wait.forHealthCheck())
    .up();

  globalThis.__ENVIRONMENT__ = environment;
  // 👍🏼 We're ready
  console.timeEnd('globalSetup');
};

const isPortReachable = require('is-port-reachable');
const app = require('../../../src/app');

module.exports = () => {
  let serverConnection;

  const init = (port = null) => {
    return new Promise((resolve) => {
      serverConnection = app.listen(port, () => {
        resolve(serverConnection.address());
      });
    });
  };

  const stop = async () => {
    const { port } = serverConnection.address();
    const isWebServerReachable = await isPortReachable(port);

    if (isWebServerReachable) {
      return new Promise((resolve) => {
        serverConnection.close(resolve);
      });
    }

    return Promise.resolve();
  };

  const throwIfUnreachable = async () => {
    const { port } = serverConnection.address();
    const isWebServerReachable = await isPortReachable(port);

    if (!isWebServerReachable) {
      throw new Error(`Webserver is unreachable at port ${port}`);
    }
  };

  return { init, stop, throwIfUnreachable };
};

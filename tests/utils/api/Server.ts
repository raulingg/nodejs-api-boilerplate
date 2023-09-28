import type { Server } from 'http';
import type { AddressInfo } from 'net';
import isPortReachable from 'is-port-reachable';
import app from '../../../src/app.js';

export default () => {
  let serverConnection: Server;

  const init = (port = null): PromiseLike<number> => {
    return new Promise((resolve) => {
      serverConnection = app.listen(port, () => {
        const { port } = serverConnection.address() as AddressInfo;
        resolve(port);
      });
    });
  };

  const stop = async () => {
    const { port } = serverConnection.address() as AddressInfo;
    const isWebServerReachable = await isPortReachable(port);

    if (isWebServerReachable) {
      return new Promise((resolve) => {
        serverConnection.close(resolve);
      });
    }

    return Promise.resolve();
  };

  const throwIfUnreachable = async () => {
    const { port } = serverConnection.address() as AddressInfo;
    const isWebServerReachable = await isPortReachable(port);

    if (!isWebServerReachable) {
      throw new Error(`Webserver is unreachable at port ${port}`);
    }
  };

  return { init, stop, throwIfUnreachable };
};

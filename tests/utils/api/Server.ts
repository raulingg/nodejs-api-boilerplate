import type { Server } from 'http';
import type { AddressInfo } from 'net';
import isPortReachable from 'is-port-reachable';
import app from '../../../src/app.js';

export default () => {
  let server: Server;

  const init = (port = null): PromiseLike<number> => {
    return new Promise((resolve) => {
      server = app.listen(port, () => {
        const { port } = server.address() as AddressInfo;
        resolve(port);
      });
    });
  };

  const stop = async () => {
    const { port } = server.address() as AddressInfo;

    if (await isPortReachable(port)) {
      return new Promise((resolve) => {
        server.close(resolve);
      });
    }
  };

  const throwIfUnreachable = async () => {
    const { port } = server.address() as AddressInfo;

    if (!(await isPortReachable(port))) {
      throw new Error(`Webserver is unreachable at port ${port}`);
    }
  };

  return { init, stop, throwIfUnreachable };
};

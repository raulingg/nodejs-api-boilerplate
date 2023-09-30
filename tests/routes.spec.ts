import { describe, expect, beforeAll, afterAll, test, jest } from '@jest/globals';
import mongoose from 'mongoose';
import type { AxiosInstance } from 'axios';
import { ApiClient, ApiResponses, ApiServer } from './utils/api/index.js';
import config from './config.js';

const apiServer = ApiServer();
let apiClient: AxiosInstance;

beforeAll(async () => {
  await mongoose.connect(config.db.uri, config.db.options);

  const port = await apiServer.init(null);
  await apiServer.throwIfUnreachable();

  apiClient = ApiClient({
    baseURL: `http://localhost:${port}`,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await apiServer.stop();
});

describe('Common routes', () => {
  describe('Welcome /', () => {
    test('When / is visited, Then return 200 response', async () => {
      const endpoint = '/';

      const { status, data } = await apiClient.get<string>(endpoint);

      expect({ status, data }).toStrictEqual(ApiResponses.ok('Hello world - Images API'));
    });
  });

  describe('404 - Not Found', () => {
    test('When an unset path is visited, Then return 404 response', async () => {
      const endpoint = '/whatever';

      const { status, data } = await apiClient.get<string>(endpoint);

      expect({ status, data }).toStrictEqual(ApiResponses.notFound(`path /whatever undefined`));
    });
  });

  describe('Health check', () => {
    const endpoint = '/health';

    test(`When ${endpoint} is visited, Then return 200 response and info`, async () => {
      const { status, data } = await apiClient.get<string>(endpoint);

      expect({ status, data }).toStrictEqual(
        ApiResponses.ok({ status: 'ok', info: { mongo: { status: 'up' } } }),
      );
    });

    test(`When ${endpoint} is visited and db is down, Then return 504 response and info`, async () => {
      jest.spyOn(mongoose.connection.db, 'command').mockImplementationOnce(() => ({ ok: 0 }));

      const { status, data } = await apiClient.get<string>(endpoint);

      expect({ status, data }).toStrictEqual({
        status: 503,
        data: {
          status: 'error',
          error: {
            mongo: {
              status: 'down',
            },
          },
        },
      });
    });
  });
});

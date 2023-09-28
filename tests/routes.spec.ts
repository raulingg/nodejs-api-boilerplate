import { describe, expect, beforeAll, afterAll, test } from '@jest/globals';
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

describe('Welcome /', () => {
  test('When / is visited, Then get back 200 and a welcome message', async () => {
    const endpoint = '/';

    const { status, data } = await apiClient.get<string>(endpoint);

    expect({ status, data }).toStrictEqual(ApiResponses.ok('Hello world - Images API'));
  });
});

describe('404 - Not Found', () => {
  test('When an unset path is visited, Then get back 404 response', async () => {
    const endpoint = '/whatever';

    const { status, data } = await apiClient.get<string>(endpoint);

    expect({ status, data }).toStrictEqual(ApiResponses.notFound(`path /whatever undefined`));
  });
});

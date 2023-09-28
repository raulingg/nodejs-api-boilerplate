import { describe, expect, beforeAll, afterAll, test } from '@jest/globals';
import mongoose from 'mongoose';
import { ApiClient, ApiResponses, ApiServer } from '../../utils/api/index.js';
import type { AxiosInstance, Method } from 'axios';
import type { ImageObject } from '../../../src/interfaces/mongoose.gen.js';
import config from '../../config.js';

const defaultImageProps = {
  name: 'my-image',
  key: '172s732s',
  mimetype: 'image/jpeg',
  size: 3000,
  width: 1000,
  height: 1000,
};

const fakeImageObject = (props: Partial<ImageObject> = {}) => ({
  ...defaultImageProps,
  ...props,
});

const apiServer = ApiServer();
const endpoint = '/images';
let imageApiClient: AxiosInstance;

beforeAll(async () => {
  await mongoose.connect(config.db.uri, config.db.options);

  // ️️️✅ Best Practice: Place the backend under test within the same process
  // ️️️✅ Best Practice 8.13: Specify no port for testing, only in production
  const port = await apiServer.init();

  await apiServer.throwIfUnreachable();

  // Configuring file-level HTTP client with base URL will allow
  // all the tests to approach with a shortened syntax
  imageApiClient = ApiClient({
    baseURL: `http://localhost:${port}${endpoint}`,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await apiServer.stop();
});

describe('Images API', () => {
  describe(`GET ${endpoint.concat('/:id')}`, () => {
    test('When fetching an image by id, Then should get back one document', async () => {
      // Arrange
      const body = fakeImageObject();
      const createResponse = await imageApiClient.post('/', body);
      const { id } = createResponse.data;
      const url = '/'.concat(id);

      // Act
      const { data, status } = await imageApiClient.get(url);

      // Assert
      expect({ data, status }).toStrictEqual({
        status: 200,
        data: {
          ...body,
          id,
          state: { actions: [] },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    withInvalidId('get');

    withNonExistingId('get');
  });

  describe(`POST ${endpoint}`, () => {
    test('When adding a new valid image, Then should get back a 201 response', async () => {
      const body = fakeImageObject();

      const { data, status } = await imageApiClient.post('/', body);

      expect({ status, data }).toStrictEqual(
        ApiResponses.okCreated({
          ...body,
          id: expect.any(String),
          state: { actions: [] },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });

    test('When adding an image without specifying name, get back 400 response', async () => {
      const { name, ...body } = fakeImageObject();

      const { status, data } = await imageApiClient.post('/', body);

      expect({ status, data }).toStrictEqual(
        ApiResponses.badRequestWithValidation({
          message: '"name" is required',
          keys: ['name'],
          source: 'body',
        }),
      );
    });

    test('When providing non-schema keys, get back 400 response', async () => {
      const body = {
        ...fakeImageObject(),
        extra: 'non-schema key',
      };

      const { status, data } = await imageApiClient.post('/', body);

      expect({ status, data }).toStrictEqual(
        ApiResponses.badRequestWithValidation({
          keys: ['extra'],
          message: '"extra" is not allowed',
          source: 'body',
        }),
      );
    });
  });

  describe(`PATCH ${endpoint}/:id`, () => {
    test('When updating an image with valid data, get back 204 response', async () => {
      const body = fakeImageObject();
      const createResponse = await imageApiClient.post('/', body);
      const { id } = createResponse.data;
      const updates = { name: 'my-new-name' };
      const url = '/'.concat(id);

      const response = await imageApiClient.patch(url, updates);
      const { status, data } = await imageApiClient.get(url);

      expect({
        status: response.status,
        data: response.data,
      }).toStrictEqual(ApiResponses.okNotContent());
      expect({ status, data }).toStrictEqual(
        ApiResponses.ok({
          ...body,
          id,
          name: 'my-new-name',
          state: { actions: [] },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });

    test('When providing non-schema keys, get back 400 response', async () => {
      const id = new mongoose.Types.ObjectId();
      const body = fakeImageObject();
      const updates = { ...body, extra: 'non-schema key' };
      const url = '/'.concat(id.toString());

      await imageApiClient.post('/', body);

      const { status, data } = await imageApiClient.patch(url, updates);

      expect({ status, data }).toStrictEqual(
        ApiResponses.badRequestWithValidation({
          keys: ['extra'],
          message: '"extra" is not allowed',
          source: 'body',
        }),
      );
    });

    withInvalidId('patch');

    withNonExistingId('patch');
  });

  describe(`DELETE ${endpoint}/:id`, () => {
    test('When deleting an image with valid id, get back 204 response', async () => {
      const body = fakeImageObject();
      const createResponse = await imageApiClient.post('/', body);
      const { id } = createResponse.data;
      const url = '/'.concat(id);

      const response = await imageApiClient.delete(url);
      const { status, data } = await imageApiClient.get(url);

      expect({
        status: response.status,
        data: response.data,
      }).toStrictEqual(ApiResponses.okNotContent(''));
      expect({ status, data }).toStrictEqual(
        ApiResponses.notFound(`Image with id = "${id}" not found`),
      );
    });

    withInvalidId('delete');

    withNonExistingId('delete');
  });
});

function withInvalidId(
  method: Extract<Method, 'post' | 'put' | 'delete' | 'patch' | 'get'> = 'get',
) {
  test('When providing an invalid image id, get back 400 response', async () => {
    const invalidImageId = 'null';
    const body = fakeImageObject();
    const url = '/'.concat(invalidImageId);

    const { status, data } = await imageApiClient[method](url, body);

    expect({ status, data }).toStrictEqual(
      ApiResponses.badRequestWithValidation({
        keys: ['id'],
        message: '"id" contains an invalid value',
        source: 'params',
      }),
    );
  });
}

function withNonExistingId(
  method: Extract<Method, 'post' | 'put' | 'delete' | 'patch' | 'get'> = 'post',
) {
  test('When providing a non-existing image id, get back 404 response', async () => {
    const id = new mongoose.Types.ObjectId();
    const body = fakeImageObject();
    const url = '/'.concat(id.toString());

    const { status, data } = await imageApiClient[method](url, body);

    expect({ status, data }).toStrictEqual(
      ApiResponses.notFound(`Image with id = "${id}" not found`),
    );
  });
}

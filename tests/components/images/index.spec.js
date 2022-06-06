const { default: axios } = require('axios');
const isPortReachable = require('is-port-reachable');
const { default: mongoose } = require('mongoose');
const app = require('../../../src/app');
const responses = require('../../utils/responses');

const defaultImageProps = {
  name: 'my-image',
  key: '172s732s',
  mimetype: 'image/jpeg',
  size: 3000,
  width: 1000,
  height: 1000,
};

const fakeImageObject = (props) => ({
  ...defaultImageProps,
  ...props,
});

// Configuring file-level HTTP client with base URL will allow
// all the tests to approach with a shortened syntax
let axiosAPIClient;
let serverConnection;

const initWebServer = () => {
  return new Promise((resolve) => {
    // ️️️✅ Best Practice 8.13: Specify no port for testing, only in production
    serverConnection = app.listen(null, () => {
      resolve(serverConnection.address());
    });
  });
};

const stopWebServerIfReachable = async () => {
  const { port } = serverConnection.address();
  const isWebServerReachable = await isPortReachable(port);

  if (isWebServerReachable) {
    return new Promise((resolve) => {
      serverConnection.close(resolve);
    });
  }

  return Promise.resolve();
};

beforeAll(async () => {
  await mongoose.connect(`mongodb://localhost:27018/images-test`);

  // ️️️✅ Best Practice: Place the backend under test within the same process
  const { port } = await initWebServer();
  const isWebServerReachable = await isPortReachable(port);

  if (!isWebServerReachable) {
    throw new Error(`Webserver is unreachable at port ${port}`);
  }

  const axiosConfig = {
    baseURL: `http://localhost:${port}`,
    validateStatus: () => true, // Don't throw HTTP exceptions. Delegate to the tests to decide which error is acceptable
  };
  axiosAPIClient = axios.create(axiosConfig);
});

afterAll(async () => {
  mongoose.connection.close();
  await stopWebServerIfReachable();
});

describe('Images API', () => {
  const endpoint = '/images';

  describe(`GET ${endpoint.concat('/:id')}`, () => {
    it('When fetching an image by id, Then should get back one document', async () => {
      // Arrange
      const imageBody = fakeImageObject();
      const createResponse = await axiosAPIClient.post(endpoint, imageBody);
      const { id } = createResponse.data;
      const url = endpoint.concat('/', id);

      // Act
      const { data, status } = await axiosAPIClient.get(url);
      // Assert

      expect({ data, status }).toStrictEqual({
        status: 200,
        data: {
          ...imageBody,
          id,
          state: { actions: [] },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    it('When providing an invalid image id, get back 400 response', async () => {
      const invalidImageId = 'null';
      const imageBody = fakeImageObject();
      const url = endpoint.concat('/', invalidImageId);

      const { status, data } = await axiosAPIClient.patch(url, imageBody);

      expect({ status, data }).toStrictEqual(
        responses.badRequestWithValidation({
          keys: ['id'],
          message: '"id" contains an invalid value',
          source: 'params',
        }),
      );
    });

    it('When providing a non-existing image id, get back 404 response', async () => {
      const id = mongoose.Types.ObjectId();
      const imageBody = fakeImageObject();
      const url = endpoint.concat('/', id);

      const { status, data } = await axiosAPIClient.get(url, imageBody);

      expect({ status, data }).toStrictEqual(
        responses.notFound(`Image with id = "${id}" not found`),
      );
    });
  });

  describe(`POST ${endpoint}`, () => {
    it('When adding a new valid image, Then should get back a 201 response', async () => {
      const imageBody = fakeImageObject();

      const { data, status } = await axiosAPIClient.post(endpoint, imageBody);

      expect({ status, data }).toStrictEqual({
        status: 201,
        data: {
          ...imageBody,
          id: expect.any(String),
          state: { actions: [] },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    it('When adding an image without specifying name, get back 400 response', async () => {
      const { name, ...imageBody } = fakeImageObject();

      const { status, data } = await axiosAPIClient.post(endpoint, imageBody);

      expect({ status, data }).toStrictEqual(
        responses.badRequestWithValidation({
          message: '"name" is required',
          keys: ['name'],
          source: 'body',
        }),
      );
    });
  });

  describe(`PATCH ${endpoint}/:id`, () => {
    it('When updating an image with valid data, get back 204 response', async () => {
      const imageBody = fakeImageObject();
      const createResponse = await axiosAPIClient.post(endpoint, imageBody);
      const { id } = createResponse.data;
      const updates = { name: 'my-new-name' };
      const url = endpoint.concat('/', id);

      const response = await axiosAPIClient.patch(url, updates);
      const { status, data } = await axiosAPIClient.get(url);

      expect({ status: response.status, data: response.data }).toStrictEqual({
        status: 204,
        data: '',
      });
      expect({ status, data }).toStrictEqual({
        status: 200,
        data: {
          ...imageBody,
          id,
          name: 'my-new-name',
          state: { actions: [] },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    it('When providing an invalid image id, get back 400 response', async () => {
      const invalidImageId = 'null';
      const imageBody = fakeImageObject();
      const url = endpoint.concat('/', invalidImageId);

      const { status, data } = await axiosAPIClient.patch(url, imageBody);

      expect({ status, data }).toStrictEqual(
        responses.badRequestWithValidation({
          keys: ['id'],
          message: '"id" contains an invalid value',
          source: 'params',
        }),
      );
    });
  });

  describe(`DELETE ${endpoint}/:id`, () => {
    it('When deleting an image with valid id, get back 204 response', async () => {
      const imageBody = fakeImageObject();
      const createResponse = await axiosAPIClient.post(endpoint, imageBody);
      const { id } = createResponse.data;
      const url = endpoint.concat('/', id);

      const response = await axiosAPIClient.delete(url);
      const { status, data } = await axiosAPIClient.get(url);

      expect({ status: response.status, data: response.data }).toStrictEqual({
        status: 204,
        data: '',
      });
      expect({ status, data }).toStrictEqual(
        responses.notFound(`Image with id = "${id}" not found`),
      );
    });

    it('When providing an invalid image id, get back 400 response', async () => {
      const invalidImageId = 'null';
      const url = endpoint.concat('/', invalidImageId);

      const { status, data } = await axiosAPIClient.delete(url);

      expect({ status, data }).toStrictEqual(
        responses.badRequestWithValidation({
          keys: ['id'],
          message: `"id" contains an invalid value`,
          source: 'params',
        }),
      );
    });
  });
});

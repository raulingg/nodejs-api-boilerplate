const { default: axios } = require('axios');
const isPortReachable = require('is-port-reachable');
const { default: mongoose } = require('mongoose');
const app = require('../../../src/app');

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
      serverConnection.close(() => {
        resolve();
      });
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

  describe(`POST ${endpoint}`, () => {
    it('When adding a new valid image, Then should get back a 201 response', async () => {
      // Arrange
      const imageBody = fakeImageObject();
      // Act
      const response = await axiosAPIClient.post(endpoint, imageBody);
      // Assert
      expect(response.status).toBe(201);
      expect(response.data).toStrictEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        state: { actions: [] },
        ...imageBody,
      });
    });

    it('When adding an image without specifying name, get back 400 response', async () => {
      const { name, ...imageBody } = fakeImageObject();

      const response = await axiosAPIClient.post(endpoint, imageBody);

      expect(response.status).toBe(400);
      expect(response.data.validation.body.message).toBe('"name" is required');
    });
  });

  describe(`PATCH ${endpoint}/:id`, () => {
    it('When updating an image with valid data, get back 204 response', async () => {
      const imageBody = fakeImageObject();
      const createResponse = await axiosAPIClient.post(endpoint, imageBody);
      const imageId = createResponse.data.id;
      const newImageBody = { name: 'my-new-name' };
      const url = endpoint.concat('/', imageId);

      const response = await axiosAPIClient.patch(url, newImageBody);

      expect(response.status).toBe(204);
    });

    it('When providing an invalid image id, get back 400 response', async () => {
      const invalidImageId = 'null';
      const imageBody = fakeImageObject();
      const url = endpoint.concat('/', invalidImageId);

      const response = await axiosAPIClient.patch(url, imageBody);

      expect(response.status).toBe(400);
    });
  });

  describe(`DELETE ${endpoint}/:id`, () => {
    it('When deleting an image with valid id, get back 204 response', async () => {
      const imageBody = fakeImageObject();
      const createResponse = await axiosAPIClient.post(endpoint, imageBody);
      const url = endpoint.concat('/', createResponse.data.id);

      const response = await axiosAPIClient.delete(url);

      expect(response.status).toBe(204);
    });

    it('When providing an invalid image id, get back 400 response', async () => {
      const invalidImageId = 'null';
      const url = endpoint.concat('/', invalidImageId);

      const response = await axiosAPIClient.delete(url);

      expect(response.status).toBe(400);
    });
  });
});

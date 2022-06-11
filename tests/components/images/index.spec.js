const { default: mongoose } = require('mongoose');
const { APIClient, APIResponses, APIServer } = require('../../utils/api');

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

const apiServer = APIServer();
let apiClient;

beforeAll(async () => {
  await mongoose.connect(`mongodb://localhost:27018/images-test`);

  // ️️️✅ Best Practice: Place the backend under test within the same process
  // ️️️✅ Best Practice 8.13: Specify no port for testing, only in production
  const { port } = await apiServer.init(null);

  await apiServer.throwIfUnreachable();

  // Configuring file-level HTTP client with base URL will allow
  // all the tests to approach with a shortened syntax
  apiClient = APIClient({ baseURL: `http://localhost:${port}` });
});

afterAll(async () => {
  mongoose.connection.close();
  await apiServer.stop();
});

describe('Images API', () => {
  const endpoint = '/images';

  describe(`GET ${endpoint.concat('/:id')}`, () => {
    it('When fetching an image by id, Then should get back one document', async () => {
      // Arrange
      const imageBody = fakeImageObject();
      const createResponse = await apiClient.post(endpoint, imageBody);
      const { id } = createResponse.data;
      const url = endpoint.concat('/', id);

      // Act
      const { data, status } = await apiClient.get(url);
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

      const { status, data } = await apiClient.patch(url, imageBody);

      expect({ status, data }).toStrictEqual(
        APIResponses.badRequestWithValidation({
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

      const { status, data } = await apiClient.get(url, imageBody);

      expect({ status, data }).toStrictEqual(
        APIResponses.notFound(`Image with id = "${id}" not found`),
      );
    });
  });

  describe(`POST ${endpoint}`, () => {
    it('When adding a new valid image, Then should get back a 201 response', async () => {
      const imageBody = fakeImageObject();

      const { data, status } = await apiClient.post(endpoint, imageBody);

      expect({ status, data }).toStrictEqual(
        APIResponses.okCreated({
          ...imageBody,
          id: expect.any(String),
          state: { actions: [] },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });

    it('When adding an image without specifying name, get back 400 response', async () => {
      const { name, ...imageBody } = fakeImageObject();

      const { status, data } = await apiClient.post(endpoint, imageBody);

      expect({ status, data }).toStrictEqual(
        APIResponses.badRequestWithValidation({
          message: '"name" is required',
          keys: ['name'],
          source: 'body',
        }),
      );
    });

    it('When providing non-schema keys, get back 400 response', async () => {
      const imageBody = { ...fakeImageObject(), extra: 'non-schema key' };

      const { status, data } = await apiClient.post(endpoint, imageBody);

      expect({ status, data }).toStrictEqual(
        APIResponses.badRequestWithValidation({
          keys: ['extra'],
          message: '"extra" is not allowed',
          source: 'body',
        }),
      );
    });
  });

  describe(`PATCH ${endpoint}/:id`, () => {
    it('When updating an image with valid data, get back 204 response', async () => {
      const imageBody = fakeImageObject();
      const createResponse = await apiClient.post(endpoint, imageBody);
      const { id } = createResponse.data;
      const updates = { name: 'my-new-name' };
      const url = endpoint.concat('/', id);

      const response = await apiClient.patch(url, updates);
      const { status, data } = await apiClient.get(url);

      expect({ status: response.status, data: response.data }).toStrictEqual({
        status: 204,
        data: '',
      });
      expect({ status, data }).toStrictEqual(
        APIResponses.ok({
          ...imageBody,
          id,
          name: 'my-new-name',
          state: { actions: [] },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });

    it('When providing an invalid image id, get back 400 response', async () => {
      const invalidImageId = 'null';
      const imageBody = fakeImageObject();
      const url = endpoint.concat('/', invalidImageId);

      const { status, data } = await apiClient.patch(url, imageBody);

      expect({ status, data }).toStrictEqual(
        APIResponses.badRequestWithValidation({
          keys: ['id'],
          message: '"id" contains an invalid value',
          source: 'params',
        }),
      );
    });

    it('When providing non-schema keys, get back 400 response', async () => {
      const id = mongoose.Types.ObjectId();
      const imageBody = fakeImageObject();
      const updates = { ...imageBody, extra: 'non-schema key' };
      const url = endpoint.concat('/', id);

      const { status, data } = await apiClient.patch(url, updates);

      expect({ status, data }).toStrictEqual(
        APIResponses.badRequestWithValidation({
          keys: ['extra'],
          message: '"extra" is not allowed',
          source: 'body',
        }),
      );
    });
  });

  describe(`DELETE ${endpoint}/:id`, () => {
    it('When deleting an image with valid id, get back 204 response', async () => {
      const imageBody = fakeImageObject();
      const createResponse = await apiClient.post(endpoint, imageBody);
      const { id } = createResponse.data;
      const url = endpoint.concat('/', id);

      const response = await apiClient.delete(url);
      const { status, data } = await apiClient.get(url);

      expect({ status: response.status, data: response.data }).toStrictEqual({
        status: 204,
        data: '',
      });
      expect({ status, data }).toStrictEqual(
        APIResponses.notFound(`Image with id = "${id}" not found`),
      );
    });

    it('When providing an invalid image id, get back 400 response', async () => {
      const invalidImageId = 'null';
      const url = endpoint.concat('/', invalidImageId);

      const { status, data } = await apiClient.delete(url);

      expect({ status, data }).toStrictEqual(
        APIResponses.badRequestWithValidation({
          keys: ['id'],
          message: `"id" contains an invalid value`,
          source: 'params',
        }),
      );
    });
  });
});

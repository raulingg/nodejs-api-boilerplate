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
const endpoint = '/images';
let imageApiClient;

beforeAll(async () => {
  await mongoose.connect(`mongodb://localhost:27018/images-test`);

  // ️️️✅ Best Practice: Place the backend under test within the same process
  // ️️️✅ Best Practice 8.13: Specify no port for testing, only in production
  const { port } = await apiServer.init(null);

  await apiServer.throwIfUnreachable();

  // Configuring file-level HTTP client with base URL will allow
  // all the tests to approach with a shortened syntax
  imageApiClient = APIClient({
    baseURL: `http://localhost:${port}${endpoint}`,
  });
});

afterAll(async () => {
  mongoose.connection.close();
  await apiServer.stop();
});

function withInvalidId(method) {
  it('When providing an invalid image id, get back 400 response', async () => {
    const invalidImageId = 'null';
    const body = fakeImageObject();
    const url = '/'.concat(invalidImageId);

    const { status, data } = await imageApiClient[method](url, body);

    expect({ status, data }).toStrictEqual(
      APIResponses.badRequestWithValidation({
        keys: ['id'],
        message: '"id" contains an invalid value',
        source: 'params',
      }),
    );
  });
}

function withNonExistingId(method) {
  it('When providing a non-existing image id, get back 404 response', async () => {
    const id = mongoose.Types.ObjectId();
    const body = fakeImageObject();
    const url = '/'.concat(id);

    const { status, data } = await imageApiClient[method](url, body);

    expect({ status, data }).toStrictEqual(
      APIResponses.notFound(`Image with id = "${id}" not found`),
    );
  });
}

describe('Images API', () => {
  describe(`GET ${endpoint.concat('/:id')}`, () => {
    it('When fetching an image by id, Then should get back one document', async () => {
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
    it('When adding a new valid image, Then should get back a 201 response', async () => {
      const body = fakeImageObject();

      const { data, status } = await imageApiClient.post('/', body);

      expect({ status, data }).toStrictEqual(
        APIResponses.okCreated({
          ...body,
          id: expect.any(String),
          state: { actions: [] },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });

    it('When adding an image without specifying name, get back 400 response', async () => {
      const { name, ...body } = fakeImageObject();

      const { status, data } = await imageApiClient.post('/', body);

      expect({ status, data }).toStrictEqual(
        APIResponses.badRequestWithValidation({
          message: '"name" is required',
          keys: ['name'],
          source: 'body',
        }),
      );
    });

    it('When providing non-schema keys, get back 400 response', async () => {
      const body = { ...fakeImageObject(), extra: 'non-schema key' };

      const { status, data } = await imageApiClient.post('/', body);

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
      const body = fakeImageObject();
      const createResponse = await imageApiClient.post('/', body);
      const { id } = createResponse.data;
      const updates = { name: 'my-new-name' };
      const url = '/'.concat(id);

      const response = await imageApiClient.patch(url, updates);
      const { status, data } = await imageApiClient.get(url);

      expect({ status: response.status, data: response.data }).toStrictEqual(
        APIResponses.okNotContent(''),
      );
      expect({ status, data }).toStrictEqual(
        APIResponses.ok({
          ...body,
          id,
          name: 'my-new-name',
          state: { actions: [] },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });

    it('When providing non-schema keys, get back 400 response', async () => {
      const id = mongoose.Types.ObjectId();
      const body = fakeImageObject();
      const updates = { ...body, extra: 'non-schema key' };
      const url = '/'.concat(id);

      const { status, data } = await imageApiClient.patch(url, updates);

      expect({ status, data }).toStrictEqual(
        APIResponses.badRequestWithValidation({
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
    it('When deleting an image with valid id, get back 204 response', async () => {
      const body = fakeImageObject();
      const createResponse = await imageApiClient.post('/', body);
      const { id } = createResponse.data;
      const url = '/'.concat(id);

      const response = await imageApiClient.delete(url);
      const { status, data } = await imageApiClient.get(url);

      expect({ status: response.status, data: response.data }).toStrictEqual(
        APIResponses.okNotContent(''),
      );
      expect({ status, data }).toStrictEqual(
        APIResponses.notFound(`Image with id = "${id}" not found`),
      );
    });

    withInvalidId('delete');

    withNonExistingId('delete');
  });
});

const { default: mongoose } = require('mongoose');
const { APIClient, APIResponses, APIServer } = require('../../utils/api');
const logger = require('../../../src/logger');
const { AppError } = require('../../../src/utils');

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

  const { port } = await apiServer.init(null);
  await apiServer.throwIfUnreachable();

  imageApiClient = APIClient({
    baseURL: `http://localhost:${port}${endpoint}`,
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
  await apiServer.stop();
});

describe('Images API', () => {
  describe(`Connection closed`, () => {
    const message = 'MongoClient must be connected to perform this operation';

    beforeAll(async () => {
      await mongoose.connection.close();
    });

    it('When fetching an image, Then should get back 500 response', async () => {
      const id = mongoose.Types.ObjectId();
      const url = '/'.concat(id);
      const loggerDouble = jest.spyOn(logger, 'error');
      const error = new AppError({ message, statusCode: 500 });
      const { data, status } = await imageApiClient.get(url);

      expect({ data, status }).toStrictEqual(
        APIResponses.internalError(message),
      );

      expect(loggerDouble).toHaveBeenLastCalledWith(
        error,
        'Error message from the centralized error-handling component',
      );
    });

    it('When creating an image, Then should get back 500 response', async () => {
      const body = fakeImageObject();

      const { data, status } = await imageApiClient.post('/', body);

      expect({ data, status }).toStrictEqual(
        APIResponses.internalError(message),
      );
    });

    it('When updating an image, Then should get back 500 response', async () => {
      const id = mongoose.Types.ObjectId();
      const url = '/'.concat(id);
      const updates = { name: 'my-new-name' };

      const { data, status } = await imageApiClient.patch(url, updates);

      expect({ data, status }).toStrictEqual(
        APIResponses.internalError(message),
      );
    });

    it('When deleting an image, Then should get back 500 response', async () => {
      const id = mongoose.Types.ObjectId();
      const url = '/'.concat(id);
      const body = fakeImageObject();

      const { data, status } = await imageApiClient.delete(url, body);

      expect({ data, status }).toStrictEqual(
        APIResponses.internalError(message),
      );
    });
  });

  describe(`Logging`, () => {
    it("When there's an unexpected error, Then should log error", async () => {
      await mongoose.connection.close();
      const id = mongoose.Types.ObjectId();
      const url = '/'.concat(id);
      const message = 'MongoClient must be connected to perform this operation';
      const error = new AppError({ message, statusCode: 500 });
      const loggerDouble = jest.spyOn(logger, 'error');

      await imageApiClient.get(url);

      expect(loggerDouble).toHaveBeenLastCalledWith(
        error,
        'Error message from the centralized error-handling component',
      );
    });
  });
});

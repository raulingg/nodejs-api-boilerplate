import type { AxiosInstance } from 'axios';
import { ApiClient, ApiResponses, ApiServer } from '../../utils/api';
import logger from '../../../src/logger';
import { AppError } from '../../../src/utils';
import { default as mongoose } from 'mongoose';

const defaultImageProps = {
  name: 'my-image',
  key: '172s732s',
  mimetype: 'image/jpeg',
  size: 3000,
  width: 1000,
  height: 1000,
};

const fakeImageObject = (props = {}) => ({
  ...defaultImageProps,
  ...props,
});
const MongoClientErrorMessage = 'Client must be connected before running operations';

const apiServer = ApiServer();
const endpoint = '/images';
let imageApiClient: AxiosInstance;

beforeAll(async () => {
  await mongoose.connect(`mongodb://localhost:27018/images-test`);

  const port = await apiServer.init(null);
  await apiServer.throwIfUnreachable();

  imageApiClient = ApiClient({
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
  describe(`Internal Server Error (500)`, () => {
    beforeAll(async () => {
      await mongoose.connection.close();
    });

    it('When fetching an image, Then should get back 500 response', async () => {
      const id = new mongoose.Types.ObjectId();
      const url = '/'.concat(id.toString());
      const { data, status } = await imageApiClient.get(url);

      expect({ data, status }).toStrictEqual(ApiResponses.internalError(MongoClientErrorMessage));
    });

    it('When creating an image, Then should get back 500 response', async () => {
      const body = fakeImageObject();

      const { data, status } = await imageApiClient.post('/', body);

      expect({ data, status }).toStrictEqual(ApiResponses.internalError(MongoClientErrorMessage));
    });

    it('When updating an image, Then should get back 500 response', async () => {
      const id = new mongoose.Types.ObjectId();
      const url = '/'.concat(id.toString());
      const updates = { name: 'my-new-name' };

      const { data, status } = await imageApiClient.patch(url, updates);

      expect({ data, status }).toStrictEqual(ApiResponses.internalError(MongoClientErrorMessage));
    });

    it('When deleting an image, Then should get back 500 response', async () => {
      const id = new mongoose.Types.ObjectId();
      const url = '/'.concat(id.toString());

      const { data, status } = await imageApiClient.delete(url);

      expect({ data, status }).toStrictEqual(ApiResponses.internalError(MongoClientErrorMessage));
    });
  });

  describe(`Logging`, () => {
    it("When there's an unexpected error, Then should log error", async () => {
      await mongoose.connection.close();
      const id = new mongoose.Types.ObjectId();
      const url = '/'.concat(id.toString());
      const error = new AppError({
        message: MongoClientErrorMessage,
        statusCode: 500,
      });
      const loggerDouble = jest.spyOn(logger, 'error');

      await imageApiClient.get(url);

      expect(loggerDouble).toHaveBeenLastCalledWith(
        error,
        'Error message from the centralized error-handling component',
      );
    });
  });
});

const { default: mongoose } = require('mongoose');
const { APIClient, APIServer, APIResponses } = require('./utils/api');

const apiServer = APIServer();
let apiClient;

beforeAll(async () => {
  await mongoose.connect(`mongodb://localhost:27018/images-test`);

  const { port } = await apiServer.init(null);
  await apiServer.throwIfUnreachable();

  apiClient = APIClient({ baseURL: `http://localhost:${port}` });
});

afterAll(async () => {
  mongoose.connection.close();
  await apiServer.stop();
});

describe('Welcome /', () => {
  test('When / is visited, Then get back 200 and a welcome message', async () => {
    const endpoint = '/';

    const { status, data } = await apiClient.get(endpoint);

    expect({ status, data }).toStrictEqual(APIResponses.ok('Hello world - Images API'));
  });
});

describe('404 - Not Found', () => {
  test('When an unset path is visited, Then get back 404 response', async () => {
    const endpoint = '/whatever';

    const { status, data } = await apiClient.get(endpoint);

    expect({ status, data }).toStrictEqual(APIResponses.notFound(`path /whatever undefined`));
  });
});

const request = require('supertest');

const app = require('./app');

describe('GET /', () => {
  test('Responds with 200 status code and a message', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Hello world - Images API');
  });
});

describe('404 - Not Found', () => {
  test('when route requested is unset, responds with 404 status code', async () => {
    const response = await request(app).get('/whatever');

    expect(response.status).toBe(404);
  });
});

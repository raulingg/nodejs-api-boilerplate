const request = require('supertest');
const mongoose = require('mongoose');
const config = require('../../../config');
const app = require('../../../app');
const Image = require('../models/Image');

describe('Images', () => {
  const endpoint = '/images';
  const imageBody = {
    name: 'my-image',
    key: '172s732s',
    mimetype: 'image/jpeg',
    size: 3000,
    width: 1000,
    height: 1000,
  };

  beforeAll(async () => {
    await mongoose.connect(config.db.connectionString);
  });

  beforeEach(async () => {
    await Image.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe(`POST ${endpoint}`, () => {
    test('When adding a new valid image, Then should get back a 201 response', async () => {
      // Act
      const response = await request(app).post(endpoint).send(imageBody);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(imageBody);
    });

    test('When adding an image without specifying name, get back 400 response', async () => {
      const { name, ...newImage } = imageBody;
      const response = await request(app).post(endpoint).send(newImage);

      expect(response.status).toBe(400);
      expect(response.body.validation.body.message).toBe('"name" is required');
    });
  });

  describe(`PATCH ${endpoint}/:id`, () => {
    test('When updating an image with valid data, get back 204 response', async () => {
      const updatedImage = { ...imageBody, name: 'my-new-name' };

      const createImageResponse = await request(app).post(endpoint).send(imageBody);
      const response = await request(app)
        .patch(`${endpoint}/${createImageResponse.body._id}`)
        .send(updatedImage);

      expect(response.status).toBe(204);
    });

    test('When providing an invalid image id, get back 400 response', async () => {
      const response = await request(app).patch(`${endpoint}/null`).send(imageBody);

      expect(response.status).toBe(400);
    });
  });

  describe(`DELETE ${endpoint}/:id`, () => {
    test('When deleting an image with valid id, get back 204 response', async () => {
      const createImageResponse = await request(app).post(endpoint).send(imageBody);
      const response = await request(app).delete(`${endpoint}/${createImageResponse.body._id}`);

      expect(response.status).toBe(204);
    });

    test('When providing an invalid image id, get back 400 response', async () => {
      const response = await request(app).delete(`${endpoint}/null`);
      expect(response.status).toBe(400);
    });
  });
});

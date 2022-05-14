const request = require('supertest');
const mongoose = require('mongoose')
const { Image } = require('../models');

const app = require('../../../app');

describe('Products API', () => {

  const endpoint = '/products'

  beforeEach(async () => {
    await Image.deleteMany()
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe(`POST ${endpoint}`, () => {
    test('When adding a new valid image, Then should get back a 201 response', async () => {
      // Arrange
      const newImage = {
        name: 'my-image',
        key: '172s732s',
        mimetype: 'image/jpeg',
        size: 3000,
        width: 1000,
        height: 1000
      };

      // Act
      const response = await request(app).post(endpoint).send(newImage);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(newImage);
    });

    test('When adding an image without specifying name, get back 400 response', async () => {
      const newImage = {
        key: '172s732s',
        mimetype: 'image/jpeg',
        size: 3000,
        width: 1000,
        height: 1000
      };

      const response = await request(app).post(endpoint).send(newImage);

      expect(response.status).toBe(400);
      expect(response.body.validation.body.message).toBe('"price" is required');
    });
  });

  describe(`PATCH ${endpoint}`, () => {
    test('When updating an image with valid data, get back 204 response', async () => {
      const newImage = {
        name: 'my-image',
        key: '172s732s',
        mimetype: 'image/jpeg',
        size: 3000,
        width: 1000,
        height: 1000
      };
      const updatedImage = { ...newImage, name: 'my-new-name' };

      const createImageResponse = await request(app).post(endpoint).send(newImage);
      const response = await request(app)
        .put(`${endpoint}/${createImageResponse.body.id}`)
        .send(updatedImage);

      expect(response.status).toBe(204);
    });
  });
});

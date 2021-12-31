const request = require('supertest');

const app = require('../../../app');

describe('Products API', () => {
  describe('POST /products', () => {
    test('When adding a new valid product, Then should get back a 201 response', async () => {
      // Arrange
      const productToAdd = {
        sku: '122737445',
        title: 'new product',
        description: 'any description',
        image: 'https://picsum.photos/id/237/200/300',
        available: false,
        price: 12.1,
      };

      // Act
      const response = await request(app).post('/products').send(productToAdd);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({});
    });
    test('When adding a product without specifying title, return 400', async () => {
      const productToAdd = {
        sku: '122737445',
        description: 'any description',
      };

      const response = await request(app).post('/products').send(productToAdd);

      expect(response.status).toBe(400);
    });

    test('When sending an invalid category, return 400', async () => {
      const productToAdd = {
        title: 'my title',
        sku: '122737445',
        description: 'any description',
        price: 10.12,
        categoryId: 1,
      };

      const response = await request(app).post('/products').send(productToAdd);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Category id 1 does not exist');
    });
  });
});

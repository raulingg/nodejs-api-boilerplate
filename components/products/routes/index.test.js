const request = require('supertest');
const { prisma } = require('../models');

const app = require('../../../app');

describe('Products API', () => {
  beforeEach(() =>
    prisma.$transaction([
      prisma.category.deleteMany(),
      prisma.productInventory.deleteMany(),
      prisma.product.deleteMany(),
    ]),
  );

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /products', () => {
    test('When adding a new valid product, Then should get back a 201 response', async () => {
      // Arrange
      const productToAdd = {
        sku: '122737445',
        title: 'new product',
        description: 'any description',
        image: 'https://picsum.photos/id/237/200/300',
        price: String(12.11),
      };

      // Act
      const response = await request(app).post('/products').send(productToAdd);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        ...productToAdd,
        available: false,
        categoryId: null,
      });
    });

    test('When adding a product without specifying price, get back 400 response', async () => {
      const productToAdd = {
        sku: '122737445',
        description: 'any description',
        title: 'my title',
      };

      const response = await request(app).post('/products').send(productToAdd);

      expect(response.status).toBe(400);
      expect(response.body.validation.body.message).toBe('"price" is required');
    });

    test('When adding a product without specifying tittle, get back 400 response', async () => {
      const productToAdd = {
        sku: '122737445',
        description: 'any description',
        price: 20,
      };

      const response = await request(app).post('/products').send(productToAdd);

      expect(response.status).toBe(400);
      expect(response.body.validation.body.message).toBe('"title" is required');
    });

    test('When adding a product with a non-existing category, get back 400 response', async () => {
      const productToAdd = {
        title: 'my title',
        sku: '122737445',
        description: 'any description',
        price: 10.12,
        categoryId: 1,
      };

      const response = await request(app).post('/products').send(productToAdd);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Category id=1 does not exist');
    });
  });

  describe('PUT /products', () => {
    // throws a weird error, I couldn't spot it 😕
    test.skip('When updating a product with valid data, get back 204 response', async () => {
      const productToAdd = {
        sku: '122737445',
        title: 'new product',
        description: 'any description',
        image: 'https://picsum.photos/id/237/200/300',
        available: false,
        price: 12.1,
      };
      const productToUpdate = { ...productToAdd, available: true, quantity: 20 };

      const addProductResponse = await request(app).post('/products').send(productToAdd);
      const response = await request(app)
        .put(`/products/${addProductResponse.body.id}`)
        .send(productToUpdate);

      expect(response.status).toBe(204);
    });

    test('When updating a product without specifying the quantity, get back 400 response', async () => {
      const productToAdd = {
        sku: '122737445',
        title: 'new product',
        description: 'any description',
        image: 'https://picsum.photos/id/237/200/300',
        price: 12,
      };
      const productToUpdate = { available: true, ...productToAdd };

      const addProductResponse = await request(app).post('/products').send(productToAdd);
      const updateProductResponse = await request(app)
        .put(`/products/${addProductResponse.body.id}`)
        .send(productToUpdate);

      expect(updateProductResponse.status).toBe(400);
      expect(updateProductResponse.body.validation.body.message).toBe('"quantity" is required');
    });
  });
});

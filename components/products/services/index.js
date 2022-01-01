const { productModel, categoryModel } = require('../models');
const ProductService = require('./ProductService');

module.exports = {
  productService: ProductService({ productModel, categoryModel }),
};

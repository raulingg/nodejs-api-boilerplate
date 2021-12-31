const ProductService = require('./ProductService');
const { productModel, categoryModel } = require('../models');

module.exports = {
  productService: ProductService({ productModel, categoryModel }),
};

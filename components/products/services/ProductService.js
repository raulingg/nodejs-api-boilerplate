const { AppError } = require('../../../utils');

const ProductService = ({ productModel, categoryModel }) => {
  const create = async (productData = {}) => {
    if (productData.categoryId) {
      const category = await categoryModel.findUnique({ where: { id: productData.categoryId } });

      if (!category) {
        throw new AppError({
          description: `Category id ${productData.categoryId} does not exist`,
          statusCode: 400,
        });
      }
    }

    const newProduct = await productModel.create({
      data: {
        sku: productData.sku,
        title: productData.title,
        description: productData.description,
        image: productData.image,
        price: productData.price,
        categoryId: productData.categoryId,
        available: productData.available,
        productInventory: { create: { quantity: productData.quantity } },
      },
    });

    return newProduct;
  };

  return {
    create,
  };
};

module.exports = ProductService;

const { AppError } = require('../../../utils');

const ProductService = ({ productModel, categoryModel }) => {
  const findCategoryByIdOrThrow = async (id) => {
    const category = await categoryModel.findUnique({ where: { id } });

    if (!category) {
      throw new AppError({
        description: `Category id=${id} does not exist`,
        statusCode: 400,
      });
    }

    return category;
  };

  const create = async ({ categoryId, quantity, ...rest }) => {
    if (categoryId) {
      await findCategoryByIdOrThrow(categoryId);
    }

    return productModel.create({
      data: { ...rest, categoryId, productInventory: { create: { quantity } } },
    });
  };

  const update = async (id, { categoryId, quantity, ...rest }) => {
    if (categoryId) {
      await findCategoryByIdOrThrow(categoryId);
    }

    return productModel.update({
      where: { id },
      data: { ...rest, categoryId, productInventory: { update: { quantity } } },
    });
  };

  return {
    create,
    update,
  };
};

module.exports = ProductService;

const { errors } = require('../../../errorHandler');
const { Image } = require('../models');

const ImageNotFoundError = (id) =>
  errors.NotFound(`Image with id = "${id}" not found`);

const ImageService = () => {
  const getById = async (id) => {
    const imageInstance = await Image.findById(id).orFail(
      ImageNotFoundError(id),
    );
    return imageInstance.toObject();
  };

  const create = async (newImage) => {
    const imageInstance = await Image.create(newImage);
    return imageInstance.toObject();
  };

  const updateById = async (id, updates) => {
    const imageInstance = await Image.findByIdAndUpdate(id, updates).orFail(
      ImageNotFoundError(id),
    );

    return imageInstance.toObject();
  };

  const deleteById = async (id) => {
    return await Image.findByIdAndDelete(id, { projection: '_id' }).orFail(
      ImageNotFoundError(id),
    );
  };

  return { create, updateById, deleteById, getById };
};

module.exports = ImageService;

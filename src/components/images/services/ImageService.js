const { errors } = require('../../../errorHandler');
const { Image } = require('../models');

const ImageService = () => {
  const getById = async (id) => {
    const imageInstance = await Image.findById(id);

    if (!imageInstance) {
      throw errors.NotFound(`Image with id = "${id}" not found`);
    }

    return imageInstance.toObject();
  };

  const create = async (newImage) => {
    const imageInstance = await Image.create(newImage);
    return imageInstance.toObject();
  };

  const updateById = async (id, updates) => {
    return await Image.updateOne({ _id: id }, updates);
  };

  const deleteById = (id) => Image.deleteOne({ _id: id });

  return { create, updateById, deleteById, getById };
};

module.exports = ImageService;

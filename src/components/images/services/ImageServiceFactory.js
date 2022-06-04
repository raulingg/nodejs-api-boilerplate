/**
 * @typedef {import("../models/Image")} Image
 */

/**
 * @param {Image} ImageModel
 */
const ImageServiceFactory = (ImageModel) => {
  const create = async (newImage) => {
    const imageInstance = await ImageModel.create(newImage);
    return imageInstance.toObject();
  };

  const updateById = async (_id, updates) => {
    return await ImageModel.updateOne({ _id }, updates);
  };

  const deleteById = (_id) => ImageModel.deleteOne({ _id });

  return { create, updateById, deleteById };
};

module.exports = ImageServiceFactory;

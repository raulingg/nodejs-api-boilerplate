const ImageServiceFactory = (ImageModel) => {
  const create = (newImage) => ImageModel.create(newImage);

  const updateById = (_id, updates) => ImageModel.updateOne({ _id }, updates);

  const deleteById = (_id) => ImageModel.deleteOne({ _id });

  return { create, updateById, deleteById };
};

module.exports = ImageServiceFactory;

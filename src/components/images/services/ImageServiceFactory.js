const ImageService = (ImageModel) => {
  const create = (newImage) => ImageModel.create(newImage);

  const updateById = (id, updates) => ImageModel.updateOne({ id }, updates);

  const deleteById = (id) => ImageModel.deleteOne({ id });

  return { create, updateById, deleteById };
};

module.exports = ImageService;

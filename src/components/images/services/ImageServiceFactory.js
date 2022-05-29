const ImageServiceFactory = (ImageModel) => {
  const create = async (newImage) => {
    const imageInstance = await ImageModel.create(newImage);
    return imageInstance.toObject();
  };

  const updateById = async (_id, updates) => {
    const imageInstance = await ImageModel.updateOne({ _id }, updates);
    return imageInstance.toObject();
  };

  const deleteById = (_id) => ImageModel.deleteOne({ _id });

  return { create, updateById, deleteById };
};

module.exports = ImageServiceFactory;

import { errors } from '../../../errorHandler';
import { Image } from '../models';

export const ImageService = () => {
  const getById = async (id: string) => {
    const imageInstance = await Image.findById(id).orFail(
      ImageNotFoundError(id),
    );
    return imageInstance.toObject();
  };

  const create = async (newImage) => {
    const imageInstance = await Image.create(newImage);
    return imageInstance.toObject();
  };

  const updateById = async (id: string, updates) => {
    const imageInstance = await Image.findByIdAndUpdate(id, updates).orFail(
      ImageNotFoundError(id),
    );

    return imageInstance.toObject();
  };

  const deleteById = async (id: string) => {
    return await Image.findByIdAndDelete(id, { projection: '_id' }).orFail(
      ImageNotFoundError(id),
    );
  };

  return { create, updateById, deleteById, getById };
};

const ImageNotFoundError = (id: string) =>
  errors.NotFound(`Image with id = "${id}" not found`);
import { errors } from '../../../errorHandler.js';
import type { ImageModel, ImageObject } from '../../../interfaces/mongoose.gen.js';

export const ImageService = (image: ImageModel) => {
  const getById = async (id: string) => {
    return (await image.findById(id).orFail(ImageNotFoundError(id))).toJSON<ImageObject>();
  };

  const create = async (newImage: ImageObject) => {
    const imageInstance = await image.create(newImage);
    return imageInstance.toJSON<ImageObject>();
  };

  const updateById = async (id: string, updates: Partial<ImageObject>) => {
    return (
      await image.findByIdAndUpdate(id, updates).orFail(ImageNotFoundError(id))
    ).toJSON<ImageObject>();
  };

  const deleteById = async (id: string) => {
    return await image.findByIdAndDelete(id, { projection: '_id' }).orFail(ImageNotFoundError(id));
  };

  return { create, updateById, deleteById, getById };
};

const ImageNotFoundError = (id: string) => errors.NotFound(`Image with id = "${id}" not found`);

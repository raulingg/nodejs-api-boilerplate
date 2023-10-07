import { errors } from '../../../errorHandler.js';
import type { ImageModel, ImageObject } from '../../../interfaces/mongoose.gen.js';

export const ImageService = (imageRepository: ImageModel) => {
  const getById = async (id: string) => {
    const image = await imageRepository.findById(id);
    if (!image) {
      throw ImageNotFoundError(id);
    }
    return image.toJSON<ImageObject>();
  };

  const create = async (newImage: ImageObject) => {
    const imageInstance = await imageRepository.create(newImage);

    return imageInstance.toJSON<ImageObject>();
  };

  const updateById = async (id: string, updates: Partial<ImageObject>) => {
    const image = await imageRepository.findByIdAndUpdate(id, updates);
    if (!image) {
      throw ImageNotFoundError(id);
    }

    return image.toJSON<ImageObject>();
  };

  const deleteById = async (id: string): Promise<void> => {
    const result = await imageRepository.findByIdAndDelete(id, { projection: '_id' });
    if (!result) {
      throw ImageNotFoundError(id);
    }
  };

  return { create, updateById, deleteById, getById };
};

const ImageNotFoundError = (id: string) =>
  errors.ResourceNotFoundError({ message: `Image with id = "${id}" not found`, statusCode: 404 });

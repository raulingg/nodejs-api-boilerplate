import { errors } from '../../../errorHandler.js';
import type { Image } from '../entities/Image.js';
import type { ImageRepo } from '../repos/ImageRepo.js';
import type { ImageService } from './ImageService.js';

export function ImageServiceImpl(imageRepo: ImageRepo<Image>): ImageService<Image> {
  const findImageById = async (id: string) => {
    const image = await imageRepo.findById(id);

    if (image === null) {
      throw ImageNotFoundError(id);
    }

    return image;
  };

  const createImage = async (newImage: Image): Promise<Image> => {
    return await imageRepo.create(newImage);
  };

  const updateImage = async (id: string, updates: Partial<Image>): Promise<Image> => {
    const image = await imageRepo.updateOne(id, updates);

    if (image === null) {
      throw ImageNotFoundError(id);
    }

    return image;
  };

  const deleteImage = async (id: string) => {
    const result = await imageRepo.deleteOne(id);
    if (!result) {
      throw ImageNotFoundError(id);
    }
  };

  return { createImage, deleteImage, updateImage, findImageById };
}

const ImageNotFoundError = (id: string) =>
  errors.ResourceNotFoundError({ message: `Image with id = "${id}" not found`, statusCode: 404 });

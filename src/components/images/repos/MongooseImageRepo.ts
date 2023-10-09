import type { ImageRepo } from './ImageRepo.js';
import type { Model } from 'mongoose';
import type { Image } from '../entities/Image.js';

export function MongooseImageRepo(imageModel: Model<Image>): ImageRepo<Image> {
  async function findById(id: string) {
    const image = await imageModel.findById(id);

    if (image !== null) {
      return image.toObject();
    }

    return image;
  }

  async function create(newImage: Image): Promise<Image> {
    const image = await imageModel.create(newImage);

    return image.toObject();
  }

  async function updateOne(id: string, updates: Partial<Image>): Promise<Image | null> {
    const image = await imageModel.findByIdAndUpdate(id, updates);

    if (image !== null) {
      return image.toObject();
    }

    return image;
  }

  async function deleteOne(id: string): Promise<boolean> {
    const result = await imageModel.deleteOne({ _id: id });

    return result.deletedCount === 1;
  }

  return { findById, create, updateOne, deleteOne };
}

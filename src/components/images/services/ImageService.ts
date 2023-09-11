import { errors } from '../../../errorHandler';
import { ImageObject } from '../../../interfaces/mongoose.gen';
import { Image } from '../models';

export const ImageService = () => {
  const getById = async (id: string): Promise<ImageObject> => {
    return (await Image.findById(id).orFail(ImageNotFoundError(id))).toObject();
  };

  const create = async (newImage: ImageObject): Promise<ImageObject> => {
    const imageInstance = await Image.create(newImage);
    return imageInstance.toObject();
  };

  const updateById = async (
    id: string,
    updates: Partial<ImageObject>,
  ): Promise<ImageObject> => {
    return await Image.findByIdAndUpdate(id, updates)
      .orFail(ImageNotFoundError(id))
      .lean();
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

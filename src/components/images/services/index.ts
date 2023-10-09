import { ImageServiceImpl } from './ImageServiceImpl.js';
import { MongooseImageRepo } from '../repos/MongooseImageRepo.js';
import { imageModel } from '../models/index.js';

const imageRepo = MongooseImageRepo(imageModel);
export const imageService = ImageServiceImpl(imageRepo);

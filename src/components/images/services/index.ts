import { ImageService } from './ImageService.js';
import { imageRepository } from '../models/index.js';

export const imageService = ImageService(imageRepository);

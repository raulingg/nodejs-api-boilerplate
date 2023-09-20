import { Image } from '../models/Image.js';
import { ImageService } from './ImageService.js';

export const imageService = ImageService(Image);

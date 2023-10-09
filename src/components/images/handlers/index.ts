import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import * as middlewares from './middlewares/index.js';
import { imageService } from '../services/index.js';
import type { Image } from '../entities/Image.js';

export const router = Router();

router.get(
  '/:id',
  middlewares.validParamId,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newImage = await imageService.findImageById(req.params.id as string);
      res.status(200).json(newImage);
    } catch (err) {
      next(err);
    }
  },
);

router.post('/', middlewares.create, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newImage = await imageService.createImage(req.body as Partial<Image>);
    res.status(201).json(newImage);
  } catch (err) {
    next(err);
  }
});

router.patch(
  '/:id',
  middlewares.update,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await imageService.updateImage(req.params.id as string, req.body as Partial<Image>);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  '/:id',
  middlewares.validParamId,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await imageService.deleteImage(req.params.id as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);

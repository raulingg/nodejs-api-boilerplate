const { Router } = require('express');
const { createImageMiddleware, updateImageMiddleware } = require('../middlewares');
const { ImageService } = require('../services');

const router = Router();

router.post('/', createImageMiddleware, async (req, res, next) => {
  try {
    const newImage = await ImageService.create(req.body);
    res.status(201).json(newImage);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', updateImageMiddleware, async (req, res, next) => {
  try {
    await ImageService.updateById(req.params.id, req.body);
    res.status(204).json();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

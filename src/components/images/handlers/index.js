const { Router } = require('express');
const middlewares = require('./middlewares');
const { ImageService } = require('../services');

const router = Router();

router.get('/:id', middlewares.validParamId, async (req, res, next) => {
  try {
    const newImage = await ImageService.getById(req.params.id);
    res.status(200).json(newImage);
  } catch (err) {
    next(err);
  }
});

router.post('/', middlewares.create, async (req, res, next) => {
  try {
    const newImage = await ImageService.create(req.body);
    res.status(201).json(newImage);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', middlewares.update, async (req, res, next) => {
  try {
    await ImageService.updateById(req.params.id, req.body);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', middlewares.validParamId, async (req, res, next) => {
  try {
    await ImageService.deleteById(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const { Router } = require('express');
const { createProductMiddleware, updateProductMiddleware } = require('../middlewares');
const { productService } = require('../services');

const router = Router();

router.post('/', createProductMiddleware, async (req, res, next) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', updateProductMiddleware, async (req, res, next) => {
  try {
    await productService.update(req.id, req.body);
    res.status(204).json();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const { Router } = require('express');
const { createProductMiddleware } = require('../middlewares');
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

module.exports = router;

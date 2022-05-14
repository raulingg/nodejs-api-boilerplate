const { celebrate, Joi, Segments } = require('celebrate');

const updateProductMiddleware = celebrate({
  [Segments.BODY]: Joi.object().keys({
    sku: Joi.string().trim().required(),
    title: Joi.string().trim().required(),
    description: Joi.string().required(),
    price: Joi.number().precision(2).positive().required(),
    quantity: Joi.number().positive().required(),
    available: Joi.bool().required(),
    image: Joi.string().uri().default(null),
    categoryId: Joi.number().positive().default(null),
  }),
  [Segments.PARAMS]: { id: Joi.number().positive().required() },
});

module.exports = updateProductMiddleware;

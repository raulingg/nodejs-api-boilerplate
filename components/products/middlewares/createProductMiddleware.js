const { celebrate, Joi } = require('celebrate');

module.exports = celebrate({
  body: Joi.object().keys({
    sku: Joi.string().trim().required(),
    title: Joi.string().trim().required(),
    description: Joi.string().required(),
    price: Joi.number().precision(2).positive().required(),
    image: Joi.string().uri().default(null),
    available: Joi.bool().default(false),
    categoryId: Joi.number().positive().default(null),
  }),
});

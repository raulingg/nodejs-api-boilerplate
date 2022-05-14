const { celebrate, Joi, Segments } = require('celebrate');

const createProductRequestSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    sku: Joi.string().trim().required(),
    title: Joi.string().trim().required(),
    description: Joi.string().required(),
    price: Joi.number().precision(2).positive().required(),
    quantity: Joi.number().positive(),
    image: Joi.string().uri(),
    available: Joi.bool(),
    categoryId: Joi.number().positive(),
  }),
});

module.exports = createProductRequestSchema;

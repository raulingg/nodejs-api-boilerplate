const { celebrate, Joi, Segments } = require('celebrate');

const updateProductMiddleware = celebrate({
  [Segments.BODY]: Joi.object().keys({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().trim(),
      key: Joi.string().trim(),
      mimetype: Joi.string(),
      size: Joi.number().positive(),
      width: Joi.number().positive(),
      height: Joi.number().positive(),
      source: Joi.object({
        action: Joi.object({
          type: Joi.string().trim(),
          enum: Joi.string().valid('UPLOAD', 'FETCH', 'TASK')
        }).allow(null),
        url: Joi.string().trim()
      })
    }),
  }),
  [Segments.PARAMS]: { id: Joi.string().required() },
});

module.exports = updateProductMiddleware;

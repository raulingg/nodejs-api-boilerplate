const { celebrate, Joi, Segments } = require('celebrate');

const createProductRequestSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().trim().required(),
    key: Joi.string().trim().required(),
    mimetype: Joi.string().required(),
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
});

module.exports = createProductRequestSchema;

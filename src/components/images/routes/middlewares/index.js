const { celebrate, Joi, Segments } = require('celebrate');
const { objectId } = require('../../../../utils/requestValidators');

module.exports.createImageMiddleware = celebrate({
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
        enum: Joi.string().valid('UPLOAD', 'FETCH', 'TASK'),
      }).allow(null),
      url: Joi.string().trim(),
    }),
  }),
});

module.exports.updateImageMiddleware = celebrate({
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
        enum: Joi.string().valid('UPLOAD', 'FETCH', 'TASK'),
      }).allow(null),
      url: Joi.string().trim(),
    }),
  }),
  [Segments.PARAMS]: {
    id: Joi.string().custom(objectId),
  },
});

module.exports.deleteImageMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().custom(objectId),
  },
});

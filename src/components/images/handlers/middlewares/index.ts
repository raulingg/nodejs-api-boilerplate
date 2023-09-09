import { celebrate, Joi, Segments } from 'celebrate';
import { requestValidators } from '../../../../utils';

export const create = celebrate({
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

export const update = celebrate({
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
    id: Joi.string().custom(requestValidators.objectId),
  },
});

export const validParamId = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().custom(requestValidators.objectId),
  },
});

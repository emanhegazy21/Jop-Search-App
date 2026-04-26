import Joi from 'joi';
import { Types } from 'mongoose';

const allowedStatuses = ['pending', 'accepted', 'viewed', 'in consideration', 'rejected'];

const objectIdValidator = (value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

export const createApplicationValidation = {
  body: Joi.object({
    jobId: Joi.string().custom(objectIdValidator).required(),
    userCV: Joi.object({
      secure_url: Joi.string().uri().required(),
      public_id: Joi.string().required(),
    }).required(),
  }),
};

export const updateApplicationStatusValidation = {
  params: Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
  }),
  body: Joi.object({
    status: Joi.string()
      .valid(...allowedStatuses)
      .required(),
  }),
};

export const applicationIdParamValidation = {
  params: Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
  }),
};

import Joi from "joi";

const logoSchema = Joi.object({
  secure_url: Joi.string().uri().required(),
  public_id: Joi.string().required(),
});

export const addCompanySchema = Joi.object({
  companyName: Joi.string().required(),
  description: Joi.string().required(),
  industry: Joi.string().required(),
  address: Joi.string().required(),
  numberOfEmployees: Joi.string()
    .pattern(/^\d{1,}-\d{1,}$/)
    .required()
    .messages({
      "string.pattern.base": "Employee range must be like: 10-20",
    }),
  companyEmail: Joi.string().email().required(),
  legalAttachment: logoSchema.required(),
});

export const updateCompanySchema = Joi.object({
  companyName: Joi.string(),
  description: Joi.string(),
  industry: Joi.string(),
  address: Joi.string(),
  numberOfEmployees: Joi.string().pattern(/^\d{1,}-\d{1,}$/),
  companyEmail: Joi.string().email(),
  HRs: Joi.array().items(Joi.string().length(24).hex()),
});

export const searchCompanySchema = Joi.object({
  name: Joi.string().required(),
});
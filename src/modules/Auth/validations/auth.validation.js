import Joi from "joi";

export const signupSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 2 characters',
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 2 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'string.empty': 'Email is required',
  }),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]|[0-9]|[!@#$%^&*(),.?":{}|<>]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least uppercase, number, or special character',
      'string.empty': 'Password is required',
    }),
  mobileNumber: Joi.string()
    .pattern(/^\+?[\d\s\-\(\)]{7,}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid mobile number (7+ digits, can include +, spaces, hyphens)',
    }),
  gender: Joi.string().valid('Male', 'Female').optional(),
  DOB: Joi.date().max('now').optional().messages({
    'date.max': 'Date of birth cannot be in the future',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

export const confirmOTPSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    'string.length': 'OTP must be 6 digits',
    'string.pattern.base': 'OTP must contain only numbers',
  }),
});

export const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).pattern(/^\d+$/).required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/[A-Z]|[0-9]|[!@#$%^&*(),.?":{}|<>]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least uppercase, number, or special character',
    }),
});

export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/[A-Z]|[0-9]|[!@#$%^&*(),.?":{}|<>]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least uppercase, number, or special character',
    }),
});

export const updateAccountSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  gender: Joi.string().valid('Male', 'Female'),
  DOB: Joi.date().max('now'),
  mobileNumber: Joi.string()
    .pattern(/^\+?[\d\s\-\(\)]{7,}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid mobile number',
    }),
});

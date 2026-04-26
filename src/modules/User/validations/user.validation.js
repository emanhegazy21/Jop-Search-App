import Joi from "joi";

// Update user account
export const updateUserValidation = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  gender: Joi.string().valid("Male", "Female").optional(),
  mobileNumber: Joi.string()
    .pattern(/^\+?[\d\s\-\(\)]{7,}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid mobile number (7+ digits, can include +, spaces, hyphens)',
    }),
  DOB: Joi.date().max('now').optional().messages({
    'date.max': 'Date of birth cannot be in the future',
  }),
});

export const updatePasswordValidation = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Current password is required',
  }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/[A-Z]|[0-9]|[!@#$%^&*(),.?":{}|<>]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least uppercase, number, or special character',
    }),
});

// Get profile by ID
export const getProfileValidation = Joi.object({
  userId: Joi.string().length(24).hex().required().messages({
    'string.length': 'Invalid user ID format',
  }),
});

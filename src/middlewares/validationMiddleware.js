import { AppError } from "../utils/errorHandling.js";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const validationErrors = [];

    if (!schema) return next();
    if (schema.validate) {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        validationErrors.push(
          ...error.details.map((detail) => ({
            field: detail.path.join("."),
            message: detail.message,
          })),
        );
      } else {
        req.body = value;
      }
    } else {
      ["body", "params", "query"].forEach((key) => {
        if (schema[key]) {
          const { error, value } = schema[key].validate(req[key], {
            abortEarly: false,
            stripUnknown: true,
          });
          if (error) {
            validationErrors.push(
              ...error.details.map((detail) => ({
                field: `${key}.${detail.path.join(".")}`,
                message: detail.message,
              })),
            );
          } else {
            req[key] = value;
          }
        }
      });
    }

    if (validationErrors.length > 0) {
      return next(
        new AppError(
          `Validation failed: ${JSON.stringify(validationErrors)}`,
          400,
        ),
      );
    }
    next();
  };
};

export const validate = validateRequest;

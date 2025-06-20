import { validationResult } from "express-validator";

// handle validation errors from express-validator
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  // if there are validation errors, return a 401 status with error message
  if (!errors.isEmpty()) {
    return res.status(401).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

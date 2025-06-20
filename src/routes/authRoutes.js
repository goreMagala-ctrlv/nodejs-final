import express from "express";
import { body } from "express-validator";
import {
  registerUser,
  loginUser,
  refreshJwtToken,
} from "../controllers/authController.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";

const router = express.Router();

// route for registering a new user and validation for email, name and password before calling the controller
router.post(
  "/registerUser",
  [
    body("email").isEmail().withMessage("Email must have @"),
    body("name").notEmpty().withMessage("Name is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must have 6 or more characters")
      // regex for password validation to include one uppercase letter, one lowercase and one number
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, "i")
      .withMessage(
        "Password must have at least one uppercase letter, one lowercase letter, and one number"
      ),
  ],
  validateRequest,
  registerUser
);

// route for user login
// validation for email and password
router.post(
  "/userLogin",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  loginUser
);

// route for refreshing jwt token, dont need validation here because it is called after login
router.post("/refreshJwtToken", refreshJwtToken);

export default router;

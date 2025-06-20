import express from "express";
import { body } from "express-validator";
import {
  registerUser,
  loginUser,
  refreshJwtToken,
} from "../controllers/authController.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.post(
  "/registerUser",
  [
    body("email").isEmail().withMessage("Email must have @"),
    body("name").notEmpty().withMessage("Name is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must have 6 or more characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, "i")
      .withMessage(
        "Password must have at least one uppercase letter, one lowercase letter, and one number"
      ),
  ],
  validateRequest,
  registerUser
);

router.post(
  "/userLogin",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  loginUser
);

router.post("/refreshJwtToken", refreshJwtToken);

export default router;

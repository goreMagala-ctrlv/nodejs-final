import express from "express";
import { body } from "express-validator";
import { insertTicket } from "../controllers/ticketController.js";
import { auth } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";

const router = express.Router();

// Add a new ticket, validates all required fields before adding the ticket
router.post(
  "/addTicket",
  auth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("ticket_price")
      .isNumeric()
      .withMessage("Ticket price must be a number"),
    body("from_location").notEmpty().withMessage("From location is required"),
    body("to_location").notEmpty().withMessage("To location is required"),
    body("to_location_photo_url")
      .isURL()
      .withMessage("To location photo URL must be a valid"),
  ],
  validateRequest,
  insertTicket
);

export default router;

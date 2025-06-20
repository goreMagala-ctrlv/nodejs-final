import express from "express";
import {
  GET_ALL_USERS,
  GET_USER_BY_ID,
  UPDATE_USER_BY_ID,
  BUY_TICKET,
  GET_ALL_USERS_WITH_TICKETS,
  GET_USER_BY_ID_WITH_TICKETS,
} from "../controllers/userController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all users without tickets
router.get("/", auth, GET_ALL_USERS);

// Get all users with their aggregated tickets
router.get("/withTickets", auth, GET_ALL_USERS_WITH_TICKETS);

// Get user details by ID without tickets
router.get("/:id", auth, GET_USER_BY_ID);

// Update user byy ID
router.put("/:id", auth, UPDATE_USER_BY_ID);

// Buy a ticket, needs userID and ticketID
router.post("/", auth, BUY_TICKET);

// Get a single user with their aggregated tickets by ID
router.get("/:id/withTickets", auth, GET_USER_BY_ID_WITH_TICKETS);

export default router;

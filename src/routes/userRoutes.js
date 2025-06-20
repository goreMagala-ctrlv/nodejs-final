import express from "express";
import {
  GET_ALL,
  GET_BY_ID,
  BUY_TICKET,
  GET_ALL_WITH_TICKETS,
  GET_BY_ID_WITH_TICKETS,
} from "../controllers/userController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", auth, GET_ALL);
router.get("/:id", auth, GET_BY_ID);
router.post("/", auth, BUY_TICKET);
router.get("/", auth, GET_ALL_WITH_TICKETS);
router.get("/:id", auth, GET_BY_ID_WITH_TICKETS);

export default router;

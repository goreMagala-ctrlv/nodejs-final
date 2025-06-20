import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// Check if the user has a valid JWT toeken
export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for bearer token in the auth header
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Token missing or wrong" });
  }

  const token = authHeader.split(" ")[1];
  try {
    // Verify token and get user ID
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add user to req object for later use
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// First letter capitalization
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
// ======================================================================================================================

// JWT token generation,
// jwt_token 2 hours expiration
// jwt_refresh_token 24 hours expiration
const generateTokens = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
  return { token, refreshToken };
};
// ======================================================================================================================

// Handles user registration
export const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    // CAPITAL FIRST LETTER OF THE NAME LINE
    name = capitalizeFirstLetter(name.toLowerCase());

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(401).json({ message: "Email already registered" });

    // HASHING THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create & save the new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      money_balance: 0,
      bought_tickets: [],
    });

    await user.save();

    // Generate token for sending back
    const { token, refreshToken } = generateTokens(user._id);

    res.status(201).json({
      message: "User registered successfully",
      jwt_token: token,
      jwt_refresh_token: refreshToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
// ======================================================================================================================

// User login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Wrong email or password" });

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Email or password does not match" });

    // Generate tokens
    // jwt_token 2 hours expiration
    const { token, refreshToken } = generateTokens(user._id);

    res.status(200).json({
      message: "Logged in successfully",
      jwt_token: token,
      jwt_refresh_token: refreshToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ======================================================================================================================

// jwt_token refresh when a valid one is used
export const refreshJwtToken = (req, res) => {
  const { jwt_refresh_token } = req.body;
  if (!jwt_refresh_token)
    return res.status(400).json({ message: "Refreshed token is required" });
  try {
    // Verify the refrresh token
    const payload = jwt.verify(
      jwt_refresh_token,
      process.env.JWT_REFRESH_SECRET
    );
    const token = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({ jwt_token: token });
  } catch (err) {
    // If the refresh token is invalid or expired, akss the user to log in again
    console.log(err);
    res.status(400).json({ message: "Invalid refresh token" });
  }
};

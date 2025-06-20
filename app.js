import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import ticketRoutes from "./src/routes/ticketRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/tickets", ticketRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("Connected to MongoDB"))
  .catch((err) => {
    console.log(err);
  });

app.use((_req, res) => {
  return res.status(404).json({
    message: "The endpoint does not exist",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;

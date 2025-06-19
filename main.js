import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import ticketRoutes from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/tickets", ticketRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(
    console.log(
      "%cCONNECTION TO MONGODB SUCCESSFUL",
      "color: green; font-weight: bold;"
    )
  )
  .catch((err) => {
    console.log(err);
  });

app.use((_req, res) => {
  return res.status(404).json({
    message: "The endpoint does not exist",
  });
});

app.listen(process.env.PORT, () => {
  console.log(
    `%cSERVER IS RUNNING ON PORT ${process.env.PORT}`,
    "color: green; font-weight: bold;"
  );
});

module.exports = app;

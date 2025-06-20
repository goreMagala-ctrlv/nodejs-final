import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    // Regex to validate email format to have the @ symbol
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: { type: String, required: true },
  bought_tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
  money_balance: { type: Number, default: 0 },
});

export default mongoose.model("User", userSchema);

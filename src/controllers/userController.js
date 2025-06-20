import mongoose from "mongoose";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";

// =================================================================================================================

// Fetch all users wwithout password
export const GET_ALL_USERS = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ name: 1 });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong while fetching users" });
  }
};

// =================================================================================================================

// Fetch user with an id without password
export const GET_USER_BY_ID = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(401).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong while fetching user" });
  }
};

// =================================================================================================================

// Update user by ID
export const UPDATE_USER_BY_ID = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(401).json({ message: "Invalid user ID" });
    }

    // prevents updating password and tickets
    delete updates.password;
    delete updates.bought_tickets;

    // Find user by ID and update with new data
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong while updating user" });
  }
};

// =================================================================================================================

// User buys a ticket if has enough money
export const BUY_TICKET = async (req, res) => {
  try {
    const { user_id, ticket_id } = req.body;

    // Again checks if the ids are valid mongoDB objectIDs like in line/27
    if (
      !mongoose.Types.ObjectId.isValid(user_id) ||
      !mongoose.Types.ObjectId.isValid(ticket_id)
    ) {
      return res.status(401).json({ message: "Wrong user or ticket ID" });
    }

    const user = await User.findById(user_id);
    const ticket = await Ticket.findById(ticket_id);

    if (!user || !ticket)
      return res.status(404).json({ message: "User or ticket was not found" });

    // Check if user has enough money to buy a ticket
    if (user.money_balance < ticket.ticket_price) {
      return res
        .status(401)
        .json({ message: "Not enough money to buy this ticket" });
    }

    // Removes money from user's balance and adds a ticket to bought_tickets array
    user.money_balance -= ticket.ticket_price;
    user.bought_tickets.push(ticket._id);

    await user.save();
    res.status(200).json({ message: "Ticket bought successfully" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong while buying ticket" });
  }
};

// =================================================================================================================

// Get users that have bought tickets  == aggregation
export const GET_ALL_USERS_WITH_TICKETS = async (req, res) => {
  try {
    const users = await User.aggregate([
      { $match: { bought_tickets: { $exists: true, $ne: [] } } },
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "_id",
          as: "tickets",
        },
      },
      { $project: { password: 0, bought_tickets: 0 } }, // excludes passwords
      { $sort: { name: 1 } },
    ]);
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong while fetching users with tickets",
    });
  }
};

// =================================================================================================================

// Get a single user with their bought ticket by id == aggregation
export const GET_USER_BY_ID_WITH_TICKETS = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const objectId = new mongoose.mongo.ObjectId(id);

    const user = await User.aggregate([
      { $match: { _id: objectId } },
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "_id",
          as: "tickets",
        },
      },
      { $project: { password: 0 } },
    ]).exec();

    if (!user.length) {
      return res.status(404).json({ message: "User does not exist" });
    }

    res.status(200).json(user[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong while fetching user with tickets",
    });
  }
};

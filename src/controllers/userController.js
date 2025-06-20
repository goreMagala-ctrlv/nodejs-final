import mongoose from "mongoose";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";

export const GET_ALL = async (req, res) => {
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

export const GET_BY_ID = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(401).json({ message: "Invalid user ID" });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong while fetching user" });
  }
};

export const BUY_TICKET = async (req, res) => {
  try {
    const { user_id, ticket_id } = req.body;

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

    if (user.money_balance < ticket.ticket_price) {
      return res
        .status(401)
        .json({ message: "Not enough money to buy this ticket" });
    }
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

export const GET_ALL_WITH_TICKETS = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "_id",
          as: "tickets",
        },
      },
      { $project: { password: 0 } },
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

export const GET_BY_ID_WITH_TICKETS = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(401).json({ message: "Invalid user ID" });

    const user = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "_id",
          as: "tickets",
        },
      },
      { $project: { password: 0 } },
    ]);
    if (!user.length)
      return res.status(404).json({ message: "User does not exist" });
    res.status(200).json(user[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong while fetching user with tickets",
    });
  }
};

import Ticket from "../models/Ticket.js";

// Insert new ticket in the database
export const insertTicket = async (req, res) => {
  try {
    const {
      title,
      ticket_price,
      from_location,
      to_location,
      to_location_photo_url,
    } = req.body;

    // Create a new ticket object
    const newTicket = new Ticket({
      title,
      ticket_price,
      from_location,
      to_location,
      to_location_photo_url,
    });

    await newTicket.save();
    res
      .status(201)
      .json({ message: "Ticket created successfully", ticket: newTicket });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong while creating a ticket" });
  }
};

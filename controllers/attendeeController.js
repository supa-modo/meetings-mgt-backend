const { Attendee, ParticipationRecord } = require("../models");
const { Op } = require("sequelize");

// Create a new attendee
exports.createAttendee = async (req, res) => {
  const { title, organization, phone, email, name, userId } = req.body;
  try {
    const attendee = await Attendee.create({
      title,
      organization,
      phone,
      email,
      name,
      userId,
    });
    res.status(201).json({ attendee, attendeeId: attendee.id });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating attendee", details: error.message });
  }
};

// Get all attendees
exports.getAllAttendees = async (req, res) => {
  try {
    const attendees = await Attendee.findAll();
    res.json(attendees);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching attendees", details: error.message });
  }
};

// Search for attendees
exports.searchAttendees = async (req, res) => {
  const { search } = req.query;
  try {
    const attendees = await Attendee.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { organization: { [Op.like]: `%${search}%` } },
        ],
      },
    });
    res.json(attendees);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error searching for attendees", details: error.message });
    console.error("Error searching attendees:", error);
  }
};

// Get a single attendee by ID
exports.getAttendeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const attendee = await Attendee.findByPk(id, {
      include: ParticipationRecord, // Include participation records
    });
    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }
    res.json(attendee);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching attendee", details: error.message });
  }
};

// Update an attendee
exports.updateAttendee = async (req, res) => {
  const { id } = req.params;
  const { title, organization, phone, email, name, userId } = req.body;
  try {
    const attendee = await Attendee.findByPk(id);
    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }
    await attendee.update({ title, organization, phone, email, name, userId });
    res.json(attendee);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating attendee", details: error.message });
  }
};

// Delete an attendee
exports.deleteAttendee = async (req, res) => {
  const { id } = req.params;
  try {
    const attendee = await Attendee.findByPk(id);
    if (!attendee) {
      return res.status(404).json({ error: "Attendee not found" });
    }
    await attendee.destroy();
    res.status(204).json({ message: "Attendee deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting attendee", details: error.message });
  }
};

// Check if attendee exists by name and email
exports.checkAttendee = async (req, res) => {
  const { name, email } = req.query; // Use query params from the request
  console.log("Received name:", name, "Received email:", email);

  if (!name || !email) {
    return res.status(400).json({ error: "Missing name or email parameter" });
  }

  try {
    const attendee = await Attendee.findOne({
      where: { name, email },
    });

    if (attendee) {
      // Ensure the attendeeId is returned in the response
      res.status(200).json({
        exists: true,
        attendeeId: attendee.id,
      });
    } else {
      res.status(200).json({
        exists: false,
        message: "Attendee not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error checking attendee",
      details: error.message,
    });
  }
};

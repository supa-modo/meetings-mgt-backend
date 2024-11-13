const { Meeting, ParticipationRecord } = require("../models");

// Create a new meeting
const moment = require("moment"); // Optionally, use a library like moment.js for date/time validation

exports.createMeeting = async (req, res) => {
  const {
    title,
    description,
    startDate,
    endDate,
    startTime,
    endTime,
    location,
    type,
  } = req.body;

  try {
    const meeting = await Meeting.create({
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      type,
    });
    res.status(201).json({ message: "Meeting created successfully", meeting });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error creating meeting", details: error.message });
  }
};

// Get all meetings
exports.getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.findAll();
    res.json(meetings);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching meetings", details: error.message });
  }
};

// Get a single meeting by ID
exports.getMeetingById = async (req, res) => {
  const { id } = req.params;
  try {
    // Get a single meeting by ID with detailed association options
    const meeting = await Meeting.findByPk(id, {
      include: {
        model: ParticipationRecord,
        attributes: ["participantName", "role"], // Customize fields if needed
        where: { status: "active" }, // Example of adding a condition
        required: false, // Include records even if no ParticipationRecord exists
      },
    });

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    res.json(meeting);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching meeting", details: error.message });
  }
};

// Update a meeting
exports.updateMeeting = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    startDate,
    endDate,
    startTime,
    endTime,
    location,
    type,
  } = req.body;
  try {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    await meeting.update({
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      type,
    });
    res.json(meeting);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating meeting", details: error.message });
  }
};

// Delete a meeting
exports.deleteMeeting = async (req, res) => {
  const { id } = req.params;
  try {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    await meeting.destroy();
    res.status(204).json({ message: "Meeting deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting meeting", details: error.message });
  }
};

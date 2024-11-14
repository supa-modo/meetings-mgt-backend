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
  console.log("Meeting ID:", id); // Log the meeting ID

  try {
    // Get a single meeting by ID without associations for debugging
    const meeting = await Meeting.findByPk(id, {
      include: {
        model: ParticipationRecord,
        attributes: ["attendeeId", "date"],
        required: false,
      },
    });

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    console.log("Meeting:", meeting); // Log the meeting object

    res.json(meeting);
  } catch (error) {
    console.error("Error fetching meeting:", error); // Log the full error
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

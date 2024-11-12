const { Meeting, ParticipationRecord } = require("../models");

// Create a new meeting
exports.createMeeting = async (req, res) => {
  const { title, startDate, endDate, startTime, endTime, location, type } =
    req.body;
  try {
    const meeting = await Meeting.create({
      title,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      type,
    });
    res.status(201).json(meeting);
  } catch (error) {
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
    const meeting = await Meeting.findByPk(id, {
      include: ParticipationRecord, // Include participation records
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
  const { title, startDate, endDate, startTime, endTime, location, type } =
    req.body;
  try {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    await meeting.update({
      title,
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

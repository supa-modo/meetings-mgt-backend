const { ParticipationRecord, Meeting, Attendee } = require("../models");

// Record an attendee's participation in a meeting
exports.recordParticipation = async (req, res) => {
  const { meetingId, attendeeId, date, signature } = req.body;
  try {
    const participationRecord = await ParticipationRecord.create({
      meetingId,
      attendeeId,
      date,
      signature,
    });
    res.status(201).json(participationRecord);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error recording participation", details: error.message });
  }
};

// Get participation records for a specific meeting
exports.getParticipationByMeeting = async (req, res) => {
  const { meetingId } = req.params;
  try {
    const records = await ParticipationRecord.findAll({
      where: { meetingId },
      include: [Meeting, Attendee],
    });
    res.json(records);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error fetching participation records",
        details: error.message,
      });
  }
};

// Get participation records for a specific attendee
exports.getParticipationByAttendee = async (req, res) => {
  const { attendeeId } = req.params;
  try {
    const records = await ParticipationRecord.findAll({
      where: { attendeeId },
      include: [Meeting, Attendee],
    });
    res.json(records);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error fetching participation records",
        details: error.message,
      });
  }
};

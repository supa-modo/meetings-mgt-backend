const { ParticipationRecord, Meeting, Attendee } = require("../models");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const moment = require("moment");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { meetingId, meetingDate } = req.body;
    const folderPath = path.join(
      __dirname,
      `../uploads/signatures/${meetingId}_${moment(meetingDate).format(
        "YYYY-MM-DD"
      )}`
    );
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const { attendeeName } = req.body;
    const timestamp = Date.now();
    cb(null, `${attendeeName}_${timestamp}.png`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "image/png") {
      return cb(new Error("Only PNG files are allowed!"));
    }
    cb(null, true);
  },
}).single("signature");

// Updated recordParticipation function
async function recordParticipation(req, res) {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    console.log("Form data received:", req.body);
    const { meetingId, attendeeId, meetingRole } = req.body;
    const signatureFileName = req.file?.filename;

    try {
      // Ensuring the meeting and attendee exist
      const meeting = await Meeting.findByPk(meetingId);
      const attendee = await Attendee.findByPk(attendeeId);

      if (!meeting || !attendee) {
        return res.status(400).json({ error: "Meeting or Attendee not found" });
      }

      // Creating a new participation record
      const participationRecord = await ParticipationRecord.create({
        meetingId,
        attendeeId,
        date: new Date(),
        meetingRole,
        signature: signatureFileName,
      });

      res.status(201).json({ success: true, participationRecord });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while recording participation" });
    }
  });
}

// Remove Attendee from Meeting
async function removeParticipant(req, res) {
  const { meetingId, attendeeId } = req.params;

  try {
    const participationRecord = await ParticipationRecord.findOne({
      where: { meetingId, attendeeId },
    });

    if (!participationRecord) {
      return res.status(404).json({ error: "Participation record not found" });
    }

    await participationRecord.destroy();
    res
      .status(200)
      .json({ message: "Attendee removed from the meeting successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while removing the participant" });
  }
}

// Get All Participants of a Specific Meeting
async function getParticipationByMeeting(req, res) {
  const { meetingId } = req.params;

  try {
    // Retrieve participation records for the specified meeting
    const participationRecords = await ParticipationRecord.findAll({
      where: { meetingId },
      include: [
        {
          model: Attendee,
          attributes: ["id", "name", "email", "phone", "organization"],
        },
      ],
    });

    // Map records to include signature data if available
    const participants = participationRecords.map((record) => ({
      id: record.id,
      Attendee: record.Attendee,
      signatures: record.signatures, // Assuming `signatures` is an object within ParticipationRecord with day-specific entries
    }));

    res.status(200).json(participants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({
      error: "An error occurred while retrieving participants for the meeting.",
    });
  }
}

// Get All Meetings an Attendee Has Participated In
async function getParticipationByAttendee(req, res) {
  const { attendeeId } = req.params;

  try {
    const meetings = await ParticipationRecord.findAll({
      where: { attendeeId },
      include: [
        {
          model: Meeting,
          attributes: ["id", "title", "date"], // Adjust as needed
        },
        {
          model: Attendee,
          attributes: ["id", "name"], // Adjust as needed
        },
      ],
    });

    res.status(200).json(meetings);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching meetings" });
  }
}

// Check if Participant Already Exists in the Meeting
async function checkParticipantExists(req, res) {
  const { attendeeId, meetingId } = req.query;

  try {
    // Find if a record exists with the given attendee name, email, and meeting ID
    const existingParticipant = await ParticipationRecord.findOne({
      where: { meetingId },
      include: [
        {
          model: Attendee,
          where: {
            id: attendeeId,
          },
          attributes: [], // Only include for filtering, no additional fields needed
        },
      ],
    });

    if (existingParticipant) {
      // Participant already exists
      return res.status(200).json({ exists: true });
    } else {
      // Participant does not exist
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking participant:", error);
    res
      .status(500)
      .json({ error: "An error occurred while checking participant" });
  }
}

module.exports = {
  recordParticipation,
  upload,
  removeParticipant,
  getParticipationByMeeting,
  getParticipationByAttendee,
  checkParticipantExists,
};

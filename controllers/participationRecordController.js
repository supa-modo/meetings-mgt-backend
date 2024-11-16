const { ParticipationRecord, Meeting, Attendee } = require("../models");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

// Function to decode Base64 and save as a PNG
function saveBase64Image(base64String, folderPath, fileName) {
  const base64Data = base64String.replace(/^data:image\/png;base64,/, "");
  const filePath = path.join(folderPath, fileName);

  // Ensure the folder exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(filePath, base64Data, "base64");
  return filePath;
}

let meetingID = "";
let meetingRole2 = "";

async function recordParticipation(req, res) {
  try {
    const {
      name,
      meetingId,
      meetingDate,
      meetingRole,
      signature, // Base64 string
    } = req.body;
    console.log("Form data received 2:", req.body);

    meetingID = req.body.meetingId;
    meetingRole2 = req.body.meetingRole;
    let name2 = req.body.name;
    let email2 = req.body.email;
    console.log("Meeting ID:", meetingID);
    console.log("Meeting Role:", meetingRole2);

    // Ensure the required data is available
    if (!meetingID || !meetingRole2) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Retrieve the attendee ID using name and email
    const attendeeFind = await Attendee.findOne({
      where: { name: name2, email: email2 },
    });
    if (!attendeeFind) {
      return res
        .status(404)
        .json({ error: "Attendee not found with the provided name and email" });
    }

    const attendeeID = attendeeFind.id;
    console.log("Attendee ID:", attendeeID);

    // Ensure the meeting and attendee exist
    const meeting = await Meeting.findByPk(meetingId);
    const attendee = await Attendee.findByPk(attendeeID);

    if (!meeting || !attendee) {
      return res.status(404).json({ error: "Meeting or Attendee not found" });
    }

    // Save the Base64 signature as an image
    const folderPath = path.join(
      __dirname,
      `../uploads/signatures/${meetingId}_${moment(meetingDate).format(
        "YYYY-MM-DD"
      )}`
    );
    const signatureFileName = `${name}_${Date.now()}.png`;
    saveBase64Image(signature, folderPath, signatureFileName);

    // Create the participation record
    const participationRecord = await ParticipationRecord.create({
      meetingId: meetingID,
      attendeeId: attendeeID,
      date: new Date(),
      meetingRole: meetingRole2,
      signature: signatureFileName,
    });

    res.status(201).json({ success: true, participationRecord });
  } catch (error) {
    console.error("Error recording participation:", error);
    res
      .status(500)
      .json({ error: "An error occurred while recording participation" });
  }
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
  const { meetingId, meetingDate } = req.params;

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

    // Define the base folder for signatures
    const baseFolderPath = path.join(
      __dirname,
      `../uploads/signatures/${meetingId}_${meetingDate}`
    );
    console.log(baseFolderPath);

    // Map records to include the full path to signature images
    const participants = participationRecords.map((record) => {
      // Construct the full path for the signature if it exists
      const signaturePath = record.signature
        ? path.join(baseFolderPath, record.signature)
        : null;

      return {
        id: record.id,
        Attendee: record.Attendee,
        signature: signaturePath
          ? `/uploads/signatures/${meetingId}_${meetingDate}/${record.signature}`
          : null,
      };
    });

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
  // upload,
  removeParticipant,
  getParticipationByMeeting,
  getParticipationByAttendee,
  checkParticipantExists,
};

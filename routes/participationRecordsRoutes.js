const express = require("express");
const router = express.Router();
const {
  recordParticipation,
  // upload,
  removeParticipant,
  getParticipationByMeeting,
  getParticipationByAttendee,
  checkParticipantExists,
} = require("../controllers/participationRecordController");

// # Participation Records

// POST /api/participation/recordParticipation
// Add attendee to a meeting
router.post("/recordParticipation", recordParticipation);

// DELETE /api/participation/removeParticipant/:meetingId/:attendeeId
// Remove attendee from a meeting
router.delete("/removeParticipant/:meetingId/:attendeeId", removeParticipant);

// GET /api/participation/getParticipationByMeeting/:meetingId
// Get all participants for a specific meeting
router.get("/getParticipationByMeeting/:meetingId/:meetingDate", getParticipationByMeeting);

// GET /api/participation/getParticipationByAttendee/:attendeeId
// Get all meetings an attendee has participated in
router.get(
  "/getParticipationByAttendee/:attendeeId",
  getParticipationByAttendee
);

// route to check if participant already exists
router.get("/checkParticipant", checkParticipantExists);

module.exports = router;

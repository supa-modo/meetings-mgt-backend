const express = require("express");
const participationRecordController = require("../controllers/participationRecordController");
const router = express.Router();

router.post(
  "/recordParticipation",
  participationRecordController.recordParticipation
);
router.get(
  "/getParticipationByMeeting/:meetingId",
  participationRecordController.getParticipationByMeeting
);
router.get(
  "/getParticipationByAttendee/:attendeeId",
  participationRecordController.getParticipationByAttendee
);

module.exports = router;

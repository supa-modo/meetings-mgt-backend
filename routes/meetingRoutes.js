const express = require("express");
const meetingController = require("../controllers/meetingController");
const router = express.Router();

router.post("/createMeeting", meetingController.createMeeting);
router.get("/getAllMeetings", meetingController.getAllMeetings);
router.get("/searchMeetings", meetingController.searchMeetings);
router.get("/getMeeting/:id", meetingController.getMeetingById);
router.put("/updateMeeting/:id", meetingController.updateMeeting);
router.delete("/deleteMeeting/:id", meetingController.deleteMeeting);

module.exports = router;

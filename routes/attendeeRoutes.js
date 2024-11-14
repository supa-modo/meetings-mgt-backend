const express = require("express");
const attendeeController = require("../controllers/attendeeController");
const router = express.Router();

router.post("/createAttendee", attendeeController.createAttendee);
router.get("/getAllAttendees", attendeeController.getAllAttendees);
router.get("/getAttendee/:id", attendeeController.getAttendeeById);
router.put("/updateAttendee/:id", attendeeController.updateAttendee);
router.delete("/deleteAttendee/:id", attendeeController.deleteAttendee);
router.get("/checkAttendee", attendeeController.checkAttendee);

module.exports = router;

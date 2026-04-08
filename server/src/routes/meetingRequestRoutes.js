const express = require("express");
const meetingRequestController = require("../controllers/meetingRequestController");

const router = express.Router();

router.post("/meeting-requests", meetingRequestController.createMeetingRequest);

module.exports = router;

const asyncHandler = require("../utils/asyncHandler");
const meetingRequestModel = require("../models/meetingRequestModel");
const { sendBookingReceivedEmail, sendBookingInboxEmail } = require("../utils/meetingRequestEmails");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const createMeetingRequest = asyncHandler(async (req, res) => {
  const {
    clientName,
    clientEmail,
    companyName,
    timezone,
    meetingDate,
    meetingTime,
    durationMinutes,
    message,
    guestEmails,
  } = req.body || {};

  if (!clientName || !clientEmail || !timezone || !meetingDate || !meetingTime) {
    return res.status(400).json({
      success: false,
      message: "clientName, clientEmail, timezone, meetingDate, and meetingTime are required",
    });
  }

  if (!isValidEmail(String(clientEmail))) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  const normalizedGuests = Array.isArray(guestEmails)
    ? guestEmails
        .map((email) => String(email || "").trim().toLowerCase())
        .filter(Boolean)
        .filter((email, idx, arr) => arr.indexOf(email) === idx)
    : [];

  const hasInvalidGuest = normalizedGuests.some((email) => !isValidEmail(email));

  if (hasInvalidGuest) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid guest email addresses",
    });
  }

  const meeting = await meetingRequestModel.createMeetingRequest({
    clientName: String(clientName).trim(),
    clientEmail: String(clientEmail).trim().toLowerCase(),
    companyName: companyName ? String(companyName).trim() : null,
    timezone: String(timezone).trim(),
    meetingDate: String(meetingDate).trim(),
    meetingTime: String(meetingTime).trim(),
    durationMinutes: Number(durationMinutes) > 0 ? Number(durationMinutes) : 30,
    message: message ? String(message).trim() : null,
    guestEmails: normalizedGuests,
  });

  try {
    await Promise.allSettled([
      sendBookingReceivedEmail(meeting),
      sendBookingInboxEmail(meeting),
    ]);
  } catch (error) {
    console.error("Failed to send booking acknowledgement email", error);
  }

  return res.status(201).json({
    success: true,
    data: meeting,
    message: "Meeting request submitted. It will be scheduled after admin approval.",
  });
});

module.exports = {
  createMeetingRequest,
};

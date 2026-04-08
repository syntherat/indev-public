const asyncHandler = require("../utils/asyncHandler");
const contactMessageModel = require("../models/contactMessageModel");
const { sendMessageReceivedEmail, sendMessageInboxEmail } = require("../utils/contactMessageEmails");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const createContactMessage = asyncHandler(async (req, res) => {
  const { clientName, clientEmail, topic, message } = req.body || {};

  if (!clientName || !clientEmail || !topic || !message) {
    return res.status(400).json({
      success: false,
      message: "clientName, clientEmail, topic, and message are required",
    });
  }

  if (!isValidEmail(String(clientEmail))) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  const contactMessage = await contactMessageModel.createContactMessage({
    clientName: String(clientName).trim(),
    clientEmail: String(clientEmail).trim().toLowerCase(),
    topic: String(topic).trim(),
    message: String(message).trim(),
  });

  try {
    await Promise.allSettled([sendMessageReceivedEmail(contactMessage), sendMessageInboxEmail(contactMessage)]);
  } catch (error) {
    console.error("Failed to send contact message email", error);
  }

  return res.status(201).json({
    success: true,
    data: contactMessage,
    message: "Message submitted successfully",
  });
});

module.exports = {
  createContactMessage,
};
const express = require("express");
const contactMessageController = require("../controllers/contactMessageController");

const router = express.Router();

router.post("/contact-messages", contactMessageController.createContactMessage);

module.exports = router;
const express = require("express");
const healthController = require("../controllers/healthController");

const router = express.Router();

router.get("/health", healthController.livenessCheck);
router.get("/health/live", healthController.livenessCheck);
router.get("/health/ready", healthController.readinessCheck);

module.exports = router;

const asyncHandler = require("../utils/asyncHandler");
const db = require("../config/db");

const serviceName = "indev-server";

function getBaseHealthPayload() {
  return {
    service: serviceName,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  };
}

const livenessCheck = asyncHandler(async (_req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    ...getBaseHealthPayload(),
    checks: {
      app: "up",
    },
  });
});

const readinessCheck = asyncHandler(async (_req, res) => {
  try {
    await db.query("SELECT 1");

    res.status(200).json({
      success: true,
      status: "ok",
      ...getBaseHealthPayload(),
      checks: {
        app: "up",
        database: "up",
      },
    });
  } catch (_error) {
    res.status(503).json({
      success: false,
      status: "degraded",
      ...getBaseHealthPayload(),
      checks: {
        app: "up",
        database: "down",
      },
      message: "Database is not reachable",
    });
  }
});

module.exports = {
  livenessCheck,
  readinessCheck,
};

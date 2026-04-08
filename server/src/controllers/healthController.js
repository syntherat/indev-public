const asyncHandler = require("../utils/asyncHandler");
const db = require("../config/db");

const healthCheck = asyncHandler(async (_req, res) => {
  await db.query("SELECT 1");

  res.status(200).json({
    success: true,
    status: "ok",
    service: "indev-server",
  });
});

module.exports = {
  healthCheck,
};

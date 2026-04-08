const express = require("express");
const requireUser = require("../middlewares/requireUser");
const accountController = require("../controllers/accountController");

const router = express.Router();

router.use(requireUser);

router.get("/profile", accountController.getProfile);
router.patch("/profile", accountController.updateProfile);
router.get("/orders", accountController.getOrders);

module.exports = router;

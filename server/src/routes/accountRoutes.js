const express = require("express");
const requireUser = require("../middlewares/requireUser");
const accountController = require("../controllers/accountController");

const router = express.Router();

router.use(requireUser);

router.get("/profile", accountController.getProfile);
router.patch("/profile", accountController.updateProfile);
router.get("/orders", accountController.getOrders);
router.get("/library/:productId/download-url", accountController.getLibraryDownloadUrl);

module.exports = router;

const express = require("express");
const requireUser = require("../middlewares/requireUser");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.use(requireUser);

router.get("/", cartController.getCart);
router.post("/items", cartController.addItem);
router.patch("/items/:productId", cartController.updateItem);
router.delete("/items/:productId", cartController.deleteItem);
router.post("/checkout", cartController.checkout);
router.post("/checkout/verify", cartController.verifyCheckout);

module.exports = router;
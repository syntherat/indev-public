const express = require("express");
const authController = require("../controllers/authController");
const passport = require("../auth/passport");
const env = require("../config/env");

const router = express.Router();

router.get("/google", authController.googleLogin);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: new URL("/login", env.clientOrigin).toString() }),
  authController.googleCallback
);
router.get("/github", authController.githubLogin);
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: new URL("/login", env.clientOrigin).toString() }),
  authController.githubCallback
);
router.get("/me", ...authController.me);
router.post("/logout", authController.logout);

module.exports = router;
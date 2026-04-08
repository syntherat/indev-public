const passport = require("../auth/passport");
const asyncHandler = require("../utils/asyncHandler");
const requireUser = require("../middlewares/requireUser");
const env = require("../config/env");

function sanitizeReturnTo(value) {
  if (typeof value !== "string") {
    return "/";
  }

  const trimmed = value.trim();

  if (!trimmed || !trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return "/";
  }

  return trimmed;
}

function getReturnTarget(req) {
  const returnTo = sanitizeReturnTo(req.session?.returnTo);

  if (req.session) {
    delete req.session.returnTo;
  }

  return new URL(returnTo, env.clientOrigin).toString();
}

function startOAuth(strategyName, options = {}) {
  return (req, res, next) => {
    const returnTo = sanitizeReturnTo(req.query.returnTo);

    if (req.session) {
      req.session.returnTo = returnTo;
    }

    passport.authenticate(strategyName, {
      session: true,
      ...options,
    })(req, res, next);
  };
}

function finishOAuth() {
  return (req, res) => {
    return res.redirect(getReturnTarget(req));
  };
}

const googleLogin = startOAuth("google", {
  scope: ["profile", "email"],
});

const githubLogin = startOAuth("github", {
  scope: ["user:email"],
});

const googleCallback = finishOAuth();
const githubCallback = finishOAuth();

const me = [
  requireUser,
  asyncHandler(async (req, res) => {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  }),
];

const logout = asyncHandler(async (req, res, next) => {
  if (!req.user && !req.session) {
    return res.status(200).json({ success: true });
  }

  req.logout((logoutError) => {
    if (logoutError) {
      return next(logoutError);
    }

    if (!req.session) {
      return res.status(200).json({ success: true });
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      res.clearCookie("indev.sid", {
        path: "/",
      });

      return res.status(200).json({ success: true });
    });
  });
});

module.exports = {
  googleLogin,
  googleCallback,
  githubLogin,
  githubCallback,
  me,
  logout,
};
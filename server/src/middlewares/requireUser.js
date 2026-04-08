function requireUser(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
}

module.exports = requireUser;
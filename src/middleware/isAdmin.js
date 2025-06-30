const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Forbidden",
    });
  }
  next();
};

module.exports = isAdmin;
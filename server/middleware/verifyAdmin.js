const verifyToken = require("./verifyToken");

module.exports = function (req, res, next) {
  // Use verifyToken to handle initial authenticity check
  verifyToken(req, res, () => {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: Admins Only" });
    }
    next();
  });
};

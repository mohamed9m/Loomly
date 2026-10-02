const User = require("../models/userSchema");
const requireAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (user.role == "admin") return next();
  return res.status(403).send("Unauthorized");
};
module.exports = requireAdmin;

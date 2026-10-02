const User = require("../models/userSchema");

const loadUser = async (req, _, next) => {
  if (!req.userId) return next(); //for routes that don't require authentication, we can skip loading the user
  try {
    const user = await User.findById(req.userId);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = loadUser;

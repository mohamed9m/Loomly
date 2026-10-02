const User = require("../models/userSchema");

const getMyProfile = async (req, res) => {
  const user = req.user;
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  res.status(200).json({ name: user.name, email: user.email });
};

const updateMyProfile = async (req, res, next) => {
  const user = req.user;
  const { name, email } = req.body;
  if (!name?.trim() && !email?.trim())
    return res.status(400).json({ message: "Name or email is required" });
  try {
    const updateFields = {};
    if (name?.trim()) updateFields.name = name.trim();
    if (email?.trim()) updateFields.email = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format" });
    if (updateFields.email && updateFields.email !== user.email) {
      const exists = await User.findOne({ email: email });
      if (exists)
        return res.status(409).json({ message: "Email already exists" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: updateFields,
      },
      { new: true, runValidators: true },
    ).select("-password");
    if (!updatedUser)
      return res.status(404).json({ message: "User not found." });
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getMyProfile,
  updateMyProfile,
};

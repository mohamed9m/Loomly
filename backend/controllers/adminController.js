const User = require("../models/userSchema");
const RefreshToken = require("../models/refreshTokenSchema");
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    if (users.length === 0)
      return res.json({ message: "No users in database" });
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

const editUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updateFields = {};
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User id missing." });
    if (!name?.trim() && !email?.trim())
      return res.status(400).json({ message: "Name or email is required" });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format" });
    if (name?.trim()) updateFields.name = name.trim();
    if (email?.trim()) updateFields.email = email.trim();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
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

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found." });
    await RefreshToken.deleteMany({ user: userId });
    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, deleteUser, editUser };

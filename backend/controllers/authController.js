const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshTokenSchema");
const User = require("../models/userSchema");

const handleRegister = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  if (!email?.trim() || !password?.trim())
    return res.status(400).json({ message: "Email and password are required" });
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password))
    return res.status(400).json({
      message:
        "Password must contain at least one uppercase letter and one digit",
    });
  if (!email?.trim() || !password?.trim() || !name?.trim())
    return res.status(400).json({ message: "No registeration data!" });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ message: "Invalid email format" });
  if (await User.findOne({ email: email }))
    return res.status(409).json({ message: "Email already exists" });
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await User.create({
      email: email,
      password: hashedPassword,
      name: name,
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    next(err);
  }
};

const handleLogin = async (req, res, next) => {
  console.log("railway");
  const email = req.body.email;
  const password = req.body.password;

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!email?.trim() || !password?.trim())
    return res.status(400).json({ message: "Email and password are required" });
  if (!passwordRegex.test(password))
    return res.status(400).json({
      message:
        "Password must contain at least one uppercase letter and one digit",
    });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ message: "Invalid email format" });
  try {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Invalid email or password");
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Invalid email or password");
    }
    const accessToken = jwt.sign(
      { userId: user._id, jti: crypto.randomUUID() },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      },
    );
    const refreshToken = jwt.sign(
      { userId: user._id, jti: crypto.randomUUID() },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" },
    );
    storeRefreshToken(refreshToken, user._id, next);
    req.userId = user._id;
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({ accessToken });
  } catch {
    res.status(401).json({ message: "Invalid email or password" });
  }
};
async function storeRefreshToken(refreshToken, userId, next) {
  try {
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const family_id = crypto.randomUUID();
    await RefreshToken.create({
      tokenHash: tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000 * 24 * 15),
      user: userId,
      family_id: family_id,
      revokedAt: null,
      replacedByToken: null,
    });
  } catch (err) {
    next(err);
  }
}

const handleRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  let refreshTokenDoc;
  if (!refreshToken) return res.sendStatus(401);
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    refreshTokenDoc = await RefreshToken.findOne({
      tokenHash: hashedToken,
    });
    if (refreshTokenDoc?.revoked) throw new Error("Invalid token");
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (!refreshTokenDoc)
      return res.status(403).json({ message: "Invalid token" });

    const accessToken = jwt.sign(
      { userId: decoded.userId, jti: crypto.randomUUID() },
      process.env.ACCESS_TOKEN_SECRET,
    );
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, jti: crypto.randomUUID() },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" },
    );
    const newRefreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    const newRefreshTokenDoc = await RefreshToken.create({
      tokenHash: newRefreshTokenHash,
      user: decoded.userId,
      family_id: refreshTokenDoc.family_id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000 * 24 * 15),
      revokedAt: Date.now(),
      replacedByToken: null,
    });
    refreshTokenDoc.revoked = true;
    refreshTokenDoc.replacedByToken = newRefreshTokenDoc._id;
    await refreshTokenDoc.save();
    return res
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({ accessToken });
  } catch (err) {
    console.error(err.name, err.message);
    if (
      err.message === "Invalid token" ||
      err.name === "TokenExpiredError" ||
      err.name === "JsonWebTokenError"
    ) {
      if (refreshTokenDoc)
        await RefreshToken.updateMany(
          { family_id: refreshTokenDoc.family_id },
          { $set: { revoked: true } },
        );
      return res
        .status(403)
        .clearCookie("refreshToken")
        .json({ message: "Invalid token" });
    }
    next(err);
  }
};

const handleLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.sendStatus(204);
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await RefreshToken.findOneAndUpdate(
      { tokenHash },
      { $set: { revoked: true } },
    );
    console.log("logged out");
    res.clearCookie("refreshToken");
    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  handleRegister,
  handleLogin,
  handleRefreshToken,
  handleLogout,
};

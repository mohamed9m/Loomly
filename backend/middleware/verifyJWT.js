require("dotenv").config();
const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(403);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
};

const optionalAuthUser = (req, _, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) return next();
    req.userId = decode.userId;
    next();
  });
};
module.exports = { authUser, optionalAuthUser };

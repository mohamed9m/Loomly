const { Router } = require("express");
const { authLimiter, refreshTokenLimiter } = require("../middleware/rateLimit");
const router = Router();
const {
  handleRegister,
  handleLogin,
  handleRefreshToken,
  handleLogout,
} = require("../controllers/authController");

router.post("/register", authLimiter, handleRegister);
router.post("/login", authLimiter, handleLogin);
router.post("/token", refreshTokenLimiter, handleRefreshToken);
router.post("/logout", handleLogout);

module.exports = router;

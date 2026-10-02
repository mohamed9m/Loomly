const { Router } = require("express");
const router = Router();
const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/userController");
const { authUser, optionalAuthUser } = require("../middleware/verifyJWT");
const loadUser = require("../middleware/loadUser");

router.get("/profile", authUser, loadUser, getMyProfile);
router.patch("profile", authUser, loadUser, updateMyProfile);

module.exports = router;

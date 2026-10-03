const { Router } = require("express");
const router = Router();
const { authUser } = require("../middleware/verifyJWT");
const loadUser = require("../middleware/loadUser");
const requireAdmin = require("../middleware/verifyAdmin");
const {
  getAllUsers,
  editUser,
  deleteUser,
} = require("../controllers/adminController");

router.get("/users", authUser, loadUser, requireAdmin, getAllUsers);
router.patch("/users/:id", authUser, loadUser, requireAdmin, editUser);
router.delete("/users/:id", authUser, loadUser, requireAdmin, deleteUser);

module.exports = router;

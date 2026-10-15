const { Router } = require("express");
const router = Router();
const {
  addToCart,
  mergeCart,
  removeFromCart,
  decreaseQuantity,
  getCart,
} = require("../controllers/cartController");
const { authUser, optionalAuthUser } = require("../middleware/verifyJWT");
const loadUser = require("../middleware/loadUser");
router.get("/", authUser, loadUser, getCart);
router.post("/merge", authUser, loadUser, mergeCart);
router.post("/:id", authUser, loadUser, addToCart);
router.delete("/:id", authUser, loadUser, removeFromCart);
router.patch("/:id/decrease", authUser, loadUser, decreaseQuantity);

module.exports = router;

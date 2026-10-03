const { Router } = require("express");
const { getProducts } = require("../controllers/productController");

const router = Router();

router.get("/", getProducts);

module.exports = router;

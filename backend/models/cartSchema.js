const mongoose = require("mongoose");
const Product = require("./productSchema");
const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  products: [
    {
      _id: false,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: Number,
    },
  ],
});
const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;

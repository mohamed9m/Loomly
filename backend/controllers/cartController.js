const mongoose = require("mongoose");
const Cart = require("../models/cartSchema");
const Product = require("../models/productSchema");
const addToCart = async (req, res, next) => {
  try {
    const productId = req.params.id;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        products: [
          {
            product: product._id,
            quantity: 1,
          },
        ],
      });
    } else {
      const existingProduct = cart.products.find((item) =>
        item.product.equals(product._id),
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({
          product: product._id,
          quantity: 1,
        });
      }

      await cart.save();
    }

    await cart.populate("products.product");

    res.status(200).json({
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const mergeCart = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        message: "Invalid cart items",
      });
    }

    // Validate product IDs and quantities
    for (const item of items) {
      if (
        !mongoose.isValidObjectId(item._id) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          message: "Invalid cart item",
        });
      }
    }

    // Fetch products from the database
    const productIds = [...new Set(items.map((item) => item._id))];

    const products = await Product.find({
      _id: { $in: productIds },
    });

    if (products.length !== productIds.length) {
      return res.status(404).json({
        message: "One or more products were not found",
      });
    }

    // Get the user's existing cart
    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        products: [],
      });
    }

    // Merge guest cart with database cart
    for (const item of items) {
      const product = products.find(
        (product) => product._id.toString() === item._id,
      );

      const existingProduct = cart.products.find((cartItem) =>
        cartItem.product.equals(product._id),
      );

      if (existingProduct) {
        existingProduct.quantity += item.quantity;
      } else {
        cart.products.push({
          product: product._id,
          quantity: item.quantity,
        });
      }
    }

    await cart.save();

    await cart.populate("products.product");

    res.status(200).json({
      message: "Cart merged successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
const removeFromCart = async (req, res, next) => {
  try {
    const productId = req.params.id;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (productIndex === -1) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    cart.products.splice(productIndex, 1);

    await cart.save();

    await cart.populate("products.product");

    res.status(200).json({
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
const decreaseQuantity = async (req, res, next) => {
  try {
    const productId = req.params.id;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.equals(productId), //using equals as item.product is ObjectId data type not string
    );

    if (productIndex === -1) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    const product = cart.products[productIndex];

    if (product.quantity === 1) {
      cart.products.splice(productIndex, 1);
    } else {
      product.quantity -= 1;
    }

    await cart.save();

    await cart.populate("products.product");

    res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate(
      "products.product",
    );

    if (!cart) {
      return res.status(200).json({
        cart: {
          products: [],
        },
      });
    }

    res.status(200).json({
      cart,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  decreaseQuantity,
  getCart,
  mergeCart,
};

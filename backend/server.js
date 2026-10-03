const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://loomly-three.vercel.app",
];

app.set("trust proxy", 1);
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use("/api/v1/product", require("./routes/productRouter"));
app.use("/api/v1/auth", require("./routes/authRouter"));
app.use("/api/v1/user", require("./routes/userRouter"));
app.use("/api/v1/cart", require("./routes/cartRouter"));
app.use("/api/v1/admin", require("./routes/adminRouter"));

app.use((err, req, res, next) => {
  res.status(500).json({ error: "Something went wrong!" });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}

startServer();

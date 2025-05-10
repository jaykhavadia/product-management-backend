const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
// Serve static image files
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes (placeholder for now)
app.get("/", (req, res) => {
  res.send("Server is running");
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

// Import & use route files later
module.exports = app;

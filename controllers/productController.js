const Product = require("../models/Product");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const PriceChangeLog = require("../models/PriceChangeLog");

// POST /api/products
exports.createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, error: errors.array() });

  // Check if the image file validation failed
  if (req.fileValidationError) {
    return res
      .status(400)
      .json({ success: false, message: req.fileValidationError });
  }

  try {
    const { name, productCode, price, category, manufactureDate, expiryDate } =
      req.body;

    const imagePath = req.file ? `/images/${req.file.filename}` : null;

    const exists = await Product.findOne({ productCode });
    if (exists)
      return res
        .status(400)
        .json({ success: false, error: "Product code already exists" });

    const product = new Product({
      name,
      image: imagePath,
      productCode,
      price,
      category,
      manufactureDate,
      expiryDate,
      owner: req.user._id,
    });

    await product.save();

    res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const category = req.query.category || "";

    const query = {
      name: { $regex: search, $options: "i" },
    };

    if (category) {
      query.category = category;
    }

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("owner", "name email");

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: {
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[getProducts] Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    console.error("[getProductById] Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  const { name, productCode, price, category, manufactureDate, expiryDate } =
    req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    let shouldLogPriceChange = false;
    let newPrice;

    // PRICE VALIDATION
    if (price !== undefined && price !== null && price !== product.price) {
      newPrice = parseFloat(price);
      const currentPrice = product.price;
      const minAllowed = currentPrice * 0.9;
      const maxAllowed = currentPrice * 1.1;

      if (newPrice < minAllowed || newPrice > maxAllowed) {
        return res.status(400).json({
          success: false,
          message: `Price must be within ±10%. Allowed range: ${minAllowed.toFixed(2)} - ${maxAllowed.toFixed(2)}`,
        });
      }

      // Check if price was already changed in last 24h
      const lastChange = await PriceChangeLog.findOne({
        productId: product._id,
        userId: req.user._id,
      }).sort({ changedAt: -1 });

      if (lastChange) {
        const hours = (new Date() - lastChange.changedAt) / (1000 * 60 * 60);
        if (hours < 24) {
          return res.status(400).json({
            success: false,
            message:
              "You can only update the price once every 24 hours for this product.",
          });
        }
      }

      product.price = newPrice;
      shouldLogPriceChange = true;
    }

    // IMAGE HANDLING
    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join(__dirname, "..", product.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.warn("Failed to delete old image:", err.message);
        });
      }
      product.image = `/images/${req.file.filename}`;
    }

    // Update other fields
    if (name) product.name = name;
    if (productCode) product.productCode = productCode;
    if (category) product.category = category;
    if (manufactureDate) product.manufactureDate = manufactureDate;
    if (expiryDate) product.expiryDate = expiryDate;

    await product.save();

    // Only log price change if product was saved
    if (shouldLogPriceChange) {
      await PriceChangeLog.create({
        productId: product._id,
        userId: req.user._id,
        newPrice,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  } catch (err) {
    console.error("[updateProduct] Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    // Delete image file if exists
    if (product.image) {
      const imagePath = path.join(__dirname, "..", product.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.warn("Failed to delete image:", err.message);
      });
    }

    await product.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("[deleteProduct] Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

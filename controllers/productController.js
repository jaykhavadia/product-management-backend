const Product = require("../models/Product");
const { validationResult } = require("express-validator");

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

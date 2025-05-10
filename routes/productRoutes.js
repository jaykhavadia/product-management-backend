const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  createProduct,
  getProducts,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("image"), // Handle single image upload
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("productCode").notEmpty().withMessage("Product code is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),
    body("category").notEmpty().withMessage("Category is required"),
    body("manufactureDate")
      .isISO8601()
      .withMessage("Manufacture date must be a valid date"),
    body("expiryDate")
      .isISO8601()
      .withMessage("Expiry date must be a valid date"),
    // Custom validation for expiry date > manufacture date
    body("expiryDate").custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.manufactureDate)) {
        throw new Error("Expiry date must be after manufacture date");
      }
      return true;
    }),
  ],
  (req, res, next) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    next(); // Proceed to controller
  },
  createProduct
);

router.get("/", getProducts);

module.exports = router;

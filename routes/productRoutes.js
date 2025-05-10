const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  validateCreateProduct,
  validateUpdateProduct,
} = require("../utils/validators");

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("image"), // Handle single image upload
  validateCreateProduct,
  createProduct
);

router.put(
  "/:id",
  protect,
  authorize("superuser"),
  upload.single("image"),
  validateUpdateProduct,
  updateProduct
);

router.delete("/:id", protect, authorize("superuser"), deleteProduct);

router.get("/", protect, getProducts);

router.get("/:id", protect, getProductById);

module.exports = router;

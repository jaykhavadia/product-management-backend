const { body, validationResult } = require("express-validator");

const validateCreateProduct = [
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
];

const validateUpdateProduct = [
  body("price").optional().isFloat({ gt: 0 }),
  body("manufactureDate").optional().isISO8601(),
  body("expiryDate").optional().isISO8601(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

module.exports = { validateCreateProduct, validateUpdateProduct };

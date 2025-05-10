const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  productCode: { type: String, required: true, unique: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  manufactureDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);

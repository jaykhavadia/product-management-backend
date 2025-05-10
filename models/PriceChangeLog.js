const mongoose = require('mongoose');

const priceChangeLogSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  newPrice: { type: Number, required: true },
  changedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PriceChangeLog', priceChangeLogSchema);

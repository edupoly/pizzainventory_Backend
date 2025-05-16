const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  size: String,
  qty: Number,
  total: Number,
});

const orderSchema = new mongoose.Schema({
  customerName: String,
  totalAmount: Number,
  timestamp: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['PENDING', 'PREPARING', 'FINISHED'],
    default: 'PENDING',
  },
  items: [itemSchema],
});

module.exports = mongoose.model('Order', orderSchema);

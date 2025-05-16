
const mongoose =require('mongoose');

const CartItemSchema = new mongoose.Schema({
  pizzaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza', required: true },
  name: String,
  size: String,
  quantity: Number,
  price: Number
});

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // optional
  items: [CartItemSchema],
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Cart', CartSchema);
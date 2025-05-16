
const express = require('express'); 
const mongoose =require('mongoose');
const Cart =require( '../models/Cart.js');

const router = express.Router();

router.post('/checkout', async (req, res) => {
  try {
    const { items } = req.body;

    const totalPrice = items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const cart = new Cart({
      items,
      totalPrice
    });

    await cart.save();

    res.status(201).json({ message: 'Order placed successfully', cart });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ timestamp: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

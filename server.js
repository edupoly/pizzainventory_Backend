const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const http     = require('http');
const { Server } = require('socket.io');

const cartRoutes  = require('./routes/cartRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const Order       = require('./models/Order.js');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: 'http://localhost:3000' } });

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/cart',   cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/orders/pending', async (_req, res) => {
  try {
    const orders = await Order.find({ status: 'PENDING' }).sort({ timestamp: 1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/active', async (_req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: 'FINISHED' } }).sort({ timestamp: 1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

let sharedCart = [];

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.emit('cart-updated', sharedCart);
  socket.on('update-cart', (newCart) => {
    sharedCart = newCart;
    io.emit('cart-updated', sharedCart);
  });
  socket.on('confirm-payment', (billing) => {
    console.log('Payment confirmed:', billing);
    sharedCart = [];
    io.emit('cart-updated', []);
    io.emit('payment-confirmed', billing);
  });

  socket.on('new-order', async (orderData) => {
    console.log('New order received:', orderData);
    try {
  
      const newOrder = await Order.create({ ...orderData, status: 'PENDING' });
      io.emit('order-received', newOrder);        
    } catch (err) {
      console.error('Failed to save order:', err);
    }
  });

  socket.on('proceed-order', (orderId) => {
    io.emit('order-proceeded', orderId);
  });

 
  socket.on('update-order-status', async ({ orderId, status }) => {
    try {
      await Order.findByIdAndUpdate(orderId, { status });
      io.emit('order-status-updated', { orderId, status });
    } catch (err) {
      console.error('Status update failed:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

mongoose.connect('mongodb+srv://ashritha04:chinki%402004@cluster0.jbqlq.mongodb.net/ashritha', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  server.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
})
.catch((err) => console.error('MongoDB connection failed:', err));

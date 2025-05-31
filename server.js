const express = require('express');
const cors = require('cors');
const path = require('path');

// Routes
const promoRoutes = require('./routes/promo');
const menuRoute = require('./routes/Menu'); // pastikan huruf M kecil!
const loginRoute = require('./routes/login');


const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
console.log('📦 Loading routes...');
app.use('/api/promo', promoRoutes);
console.log('✅ promoRoutes loaded');

app.use('/api/menu', menuRoute);  // POST menu
app.use('/api/login', loginRoute);             // POST login

// Run server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

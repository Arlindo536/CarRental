const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const rentalRoutes = require('./routes/rentals');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/uploads');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route to test
app.get('/', (req, res) => {
  res.send('API is running');
});

// API Routes - add one at a time
app.use('/api/auth', authRoutes);
// app.use('/api/cars', carRoutes);
// app.use('/api/rentals', rentalRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/uploads', uploadRoutes);

// Skip MongoDB connection for testing
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
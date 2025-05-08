const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
// const carRoutes = require('./routes/cars');
// const rentalRoutes = require('./routes/rentals');
// const userRoutes = require('./routes/users');
// const uploadRoutes = require('./routes/uploads');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files - ADD THIS SECTION
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Basic test route
app.get('/test', (req, res) => {
  res.send('Test route is working');
});

// API Routes
app.use('/api/auth', authRoutes);
// app.use('/api/cars', carRoutes);
// app.use('/api/rentals', rentalRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/uploads', uploadRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Replace the catch-all route with this approach
// Serve frontend for all other routes
app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    // For all other routes, serve the index.html file
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
  });
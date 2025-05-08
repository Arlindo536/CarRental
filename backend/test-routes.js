const express = require('express');
const app = express();

// Basic route that should always work
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Test each of your route files individually
//const authRoutes = require('./routes/auth');
//const carRoutes = require('./routes/cars');
//const rentalRoutes = require('./routes/rentals');
//const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/uploads');

// Use only one route at a time for testing
//app.use('/api/auth', authRoutes);
// app.use('/api/cars', carRoutes);
//app.use('/api/rentals', rentalRoutes);
//app.use('/api/users', userRoutes);
 app.use('/api/uploads', uploadRoutes);

app.listen(5001, () => {
  console.log('Test server running on port 5001');
});
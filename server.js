const express = require('express');
const path = require('path');

// Initialize express
const app = express();

// Middleware
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Basic API test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Serve index.html for all other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Set port
const PORT = 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
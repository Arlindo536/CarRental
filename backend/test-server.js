const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Test server is working');
});

app.listen(5001, () => {
  console.log('Test server running on port 5001');
});
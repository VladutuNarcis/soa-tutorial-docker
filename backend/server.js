const express = require('express');
const app = express();
const PORT = 5000;

// Simple endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});

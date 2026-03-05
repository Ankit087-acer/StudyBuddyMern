const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection - EXACTLY like your working test-db.js
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database:', process.env.MONGODB_URI);
  })
  .catch((err) => {
    console.log('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 StudyBuddy API is running!',
    status: 'active'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
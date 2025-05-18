require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static file serving for uploads and thumbnails
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/thumbnails', express.static(path.join(__dirname, 'thumbnails')));

// Root route for Render health check and browser visits
app.get('/', (req, res) => {
  res.send('🚀 QuickPeek API is running!');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if DB fails to connect
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

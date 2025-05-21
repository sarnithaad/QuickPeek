require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');

const app = express();

// Define upload directories
const UPLOADS_BASE_DIR = path.resolve(__dirname, process.env.UPLOADS_DIR || 'uploads');
const UPLOADS_VIDEO_DIR = path.join(UPLOADS_BASE_DIR, 'videos');
const UPLOADS_THUMBNAIL_DIR = path.join(UPLOADS_BASE_DIR, 'thumbnails');

// Ensure upload folders exist
[UPLOADS_BASE_DIR, UPLOADS_VIDEO_DIR, UPLOADS_THUMBNAIL_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for videos and thumbnails
app.use(
  '/uploads',
  express.static(UPLOADS_BASE_DIR, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.mp4')) {
        res.setHeader('Content-Type', 'video/mp4');
      } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (filePath.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      }
      res.setHeader('Accept-Ranges', 'bytes');
    },
  })
);

// Health check route
app.get('/', (req, res) => {
  res.send('🚀 QuickPeek API is running!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ msg: err.message || 'Internal server error' });
});

// Connect to MongoDB and start server
const mongoUri = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${mongoose.connection.name}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

// Handle unexpected crashes
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

startServer();

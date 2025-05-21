require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');

const app = express();

// Define correct directories for video and thumbnail storage
const UPLOADS_BASE_DIR = path.resolve(__dirname, 'uploads');
const UPLOADS_VIDEO_DIR = path.join(UPLOADS_BASE_DIR, 'videos');
const UPLOADS_THUMBNAIL_DIR = path.join(UPLOADS_BASE_DIR, 'thumbnails');

// Ensure upload folders exist
if (!fs.existsSync(UPLOADS_VIDEO_DIR)) fs.mkdirSync(UPLOADS_VIDEO_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_THUMBNAIL_DIR)) fs.mkdirSync(UPLOADS_THUMBNAIL_DIR, { recursive: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve videos and thumbnails from the /uploads route
app.use(
  '/uploads',
  express.static(UPLOADS_BASE_DIR, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.mp4')) {
        res.setHeader('Content-Type', 'video/mp4');
      }
      res.setHeader('Accept-Ranges', 'bytes');
    },
  })
);

app.get('/', (req, res) => {
  res.send('🚀 QuickPeek API is running!');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ msg: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler message:', err.message);
  console.error('Global error handler stack:', err.stack);
  res.status(err.status || 500).json({ msg: err.message || 'Internal server error' });
});

// MongoDB setup
const mongoUri = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected to database: ${mongoose.connection.name}`);

    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`)
    );
  } catch (err) {
    console.error('MongoDB connection error message:', err.message);
    console.error('MongoDB connection error stack:', err.stack);
    process.exit(1);
  }
}

// Uncaught and unhandled error logging
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception message:', err.message);
  console.error('Uncaught Exception stack:', err.stack);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection reason:', reason);
  if (reason instanceof Error) {
    console.error('Unhandled Rejection stack:', reason.stack);
  }
});

startServer();

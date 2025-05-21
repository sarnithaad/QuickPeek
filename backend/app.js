require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');

const app = express();

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.resolve(__dirname, 'uploads');
const THUMBNAILS_DIR = process.env.THUMBNAILS_DIR || path.resolve(__dirname, 'thumbnails');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(THUMBNAILS_DIR)) fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(UPLOADS_DIR, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    }
    res.setHeader('Accept-Ranges', 'bytes');
  }
}));
app.use('/thumbnails', express.static(THUMBNAILS_DIR));

app.get('/', (req, res) => {
  res.send('🚀 QuickPeek API is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

app.use((req, res, next) => {
  res.status(404).json({ msg: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Global error handler message:', err.message);
  console.error('Global error handler stack:', err.stack);
  res.status(err.status || 500).json({ msg: err.message || 'Internal server error' });
});

const mongoUri = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
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

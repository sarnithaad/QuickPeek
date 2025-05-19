require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');

const app = express();

// ==== Use env variables for uploads/thumbnails directories ====
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');
const THUMBNAILS_DIR = process.env.THUMBNAILS_DIR || path.join(__dirname, 'thumbnails');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);
if (!fs.existsSync(THUMBNAILS_DIR)) fs.mkdirSync(THUMBNAILS_DIR);

// ==== Middleware ====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==== Static file serving ====
app.use('/uploads', express.static(UPLOADS_DIR, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    }
    res.setHeader('Accept-Ranges', 'bytes');
  }
}));
app.use('/thumbnails', express.static(THUMBNAILS_DIR));

// ==== Root route for health check ====
app.get('/', (req, res) => {
  res.send('🚀 QuickPeek API is running!');
});

// ==== API routes ====
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

// ==== 404 handler ====
app.use((req, res, next) => {
  res.status(404).json({ msg: 'Route not found' });
});

// ==== MongoDB connection ====
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    const dbName = mongoose.connection.name;
    console.log(`MongoDB Connected to database: ${dbName}`);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// ==== Error handling ====
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// ==== Start server ====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

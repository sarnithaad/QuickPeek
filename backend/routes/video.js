const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadVideo, getVideos, likeVideo } = require('../controllers/videoController');

// Define base uploads directory and videos subfolder
const uploadDir = path.join(__dirname, '../uploads/videos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Middleware to handle multer errors gracefully
function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError || err.message === 'Only mp4 is allowed') {
    return res.status(400).json({ msg: err.message });
  }
  next(err);
}

// Routes

// POST /api/videos/upload - Upload a video (authenticated)
router.post('/upload', auth, upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = `/uploads/videos/${req.file.filename}`;

  // TODO: Save filePath and metadata to DB here...

  res.status(201).json({
    message: 'Upload successful',
    filePath,
    filename: req.file.filename,
  });
});

module.exports = router;

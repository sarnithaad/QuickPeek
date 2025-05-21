const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = require('./upload');
const { uploadVideo, getVideos, likeVideo } = require('../controllers/videoController');

// Define base uploads directory and videos subfolder
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

module.exports = upload;
// Middleware to handle multer errors gracefully
function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError || err.message === 'Only mp4 is allowed') {
    return res.status(400).json({ msg: err.message });
  }
  next(err);
}

// Routes

// POST /upload - Upload a video (authenticated)
router.post('/api/videos/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = `/uploads/${req.file.filename}`;

  // Save filePath and metadata to DB here...

  res.status(201).json({
    message: 'Upload successful',
    filePath,
    filename: req.file.filename,
  });
});

module.exports = router;

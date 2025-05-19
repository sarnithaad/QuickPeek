const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { uploadVideo, getVideos, likeVideo } = require('../controllers/videoController');

// Ensure uploads directory exists
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// Multer diskStorage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR); // Absolute path to uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

// File filter for .mp4 only
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".mp4") {
    return cb(new Error("Only mp4 is allowed"), false);
  }
  cb(null, true);
};

// Multer instance
const upload = multer({ storage, fileFilter });

// Multer error handler
function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError || err.message === 'Only mp4 is allowed') {
    return res.status(400).json({ msg: err.message });
  }
  next(err);
}

// Upload route
router.post(
  '/upload',
  auth,
  upload.single('video'), // 'video' must match frontend FormData field name
  multerErrorHandler,
  (req, res, next) => {
    console.log('Multer req.file:', req.file);
    next();
  },
  uploadVideo
);

// Get all videos
router.get('/', getVideos);

// Like a video
router.post('/like/:videoId', auth, likeVideo);

module.exports = router;

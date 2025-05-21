const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { uploadVideo, getVideos, likeVideo } = require('../controllers/videoController');

// Define base uploads directory and videos subfolder
const UPLOADS_BASE_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads');
const VIDEO_DIR = path.join(UPLOADS_BASE_DIR, 'videos');

// Ensure videos upload directory exists
if (!fs.existsSync(VIDEO_DIR)) fs.mkdirSync(VIDEO_DIR, { recursive: true });

// Configure multer storage for video files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, VIDEO_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

// File filter to allow only mp4 files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.mp4') {
    return cb(new Error('Only mp4 is allowed'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// Middleware to handle multer errors gracefully
function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError || err.message === 'Only mp4 is allowed') {
    return res.status(400).json({ msg: err.message });
  }
  next(err);
}

// Routes

// POST /upload - Upload a video (authenticated)
router.post(
  '/upload',
  auth,
  upload.single('video'),
  multerErrorHandler,
  (req, res, next) => {
    console.log('Multer req.file:', req.file);
    next();
  },
  uploadVideo
);

// GET / - Get all videos
router.get('/', getVideos);

// POST /like/:videoId - Like a video (authenticated)
router.post('/like/:videoId', auth, likeVideo);

module.exports = router;

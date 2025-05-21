const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

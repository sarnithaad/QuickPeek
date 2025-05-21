const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { uploadVideo, getVideos, likeVideo } = require('../controllers/videoController');

// Create structured uploads directory: uploads/videos and uploads/thumbnails
const UPLOADS_BASE_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads');
const VIDEO_DIR = path.join(UPLOADS_BASE_DIR, 'videos');

if (!fs.existsSync(VIDEO_DIR)) fs.mkdirSync(VIDEO_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, VIDEO_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.mp4') {
    return cb(new Error('Only mp4 is allowed'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError || err.message === 'Only mp4 is allowed') {
    return res.status(400).json({ msg: err.message });
  }
  next(err);
}

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

router.get('/', getVideos);
router.post('/like/:videoId', auth, likeVideo);

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { uploadVideo, getVideos, likeVideo } = require('../controllers/videoController');

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
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

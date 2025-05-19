const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadVideo, getVideos, likeVideo } = require('../controllers/videoController');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
function ensureUploadsDir(req, res, next) {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);
  next();
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};
const upload = multer({ storage, fileFilter });

function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError || err.message === 'Only video files are allowed!') {
    return res.status(400).json({ msg: err.message });
  }
  next(err);
}

router.post(
  '/upload',
  auth,
  ensureUploadsDir,
  upload.single('video'), // FIELD NAME MUST MATCH FRONTEND
  multerErrorHandler,
  (req, res, next) => {
    // Debug log
    console.log('Multer req.file:', req.file);
    next();
  },
  uploadVideo
);

router.get('/', getVideos);
router.post('/like/:videoId', auth, likeVideo);

module.exports = router;

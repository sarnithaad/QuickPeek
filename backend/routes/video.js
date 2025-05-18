const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { uploadVideo, getVideos, likeVideo } = require('../controllers/videoController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

router.post('/upload', auth, upload.single('video'), uploadVideo);
router.get('/', getVideos);
router.post('/like/:videoId', auth, likeVideo);

module.exports = router;

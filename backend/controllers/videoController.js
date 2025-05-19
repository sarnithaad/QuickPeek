const Video = require('../models/Video');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

exports.uploadVideo = async (req, res) => {
  try {
    // Debug: Log the file received by Multer
    console.log('Controller req.file:', req.file);

    const { title } = req.body;
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
    if (!title || typeof title !== 'string' || !title.trim()) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ msg: 'Title is required' });
    }

    // Generate thumbnail
    const videoPath = req.file.path;
    const thumbnailFilename = `${Date.now()}_thumb.jpg`;
    const thumbnailDir = path.join(__dirname, '..', 'thumbnails');
    const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);

    if (!fs.existsSync(thumbnailDir)) fs.mkdirSync(thumbnailDir);

    try {
      await new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .on('end', resolve)
          .on('error', reject)
          .screenshots({
            count: 1,
            filename: thumbnailFilename,
            folder: thumbnailDir,
            size: '320x240'
          });
      });
    } catch (ffmpegErr) {
      fs.unlink(videoPath, () => {});
      return res.status(500).json({ msg: 'Failed to generate thumbnail. Is ffmpeg installed?' });
    }

    const video = new Video({
      title: title.trim(),
      filename: req.file.filename,
      thumbnail: thumbnailFilename,
      uploadedBy: req.user.id
    });
    await video.save();

    res.json({
      msg: 'Uploaded',
      video: {
        id: video._id,
        title: video.title,
        url: `/uploads/${video.filename}`,
        thumbnail: `/thumbnails/${video.thumbnail}`,
        likes: video.likes,
        uploadedBy: video.uploadedBy ? video.uploadedBy.toString() : null
      }
    });
  } catch (err) {
    const isDev = process.env.NODE_ENV !== 'production';
    console.error('Upload error:', err);
    res.status(500).json({
      msg: 'Upload error',
      ...(isDev && { error: err.message })
    });
  }
};

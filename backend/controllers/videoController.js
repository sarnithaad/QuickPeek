const Video = require('../models/Video');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

exports.uploadVideo = async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    // Generate thumbnail
    const videoPath = req.file.path;
    const thumbnailFilename = `${Date.now()}_thumb.jpg`;
    const thumbnailPath = path.join(__dirname, '..', 'thumbnails', thumbnailFilename);

    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .on('end', resolve)
        .on('error', reject)
        .screenshots({
          count: 1,
          filename: thumbnailFilename,
          folder: path.join(__dirname, '..', 'thumbnails'),
          size: '320x240'
        });
    });

    const video = new Video({
      title,
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
        likes: video.likes
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Upload error', error: err.message });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos.map(v => ({
      id: v._id,
      title: v.title,
      url: `/uploads/${v.filename}`,
      thumbnail: `/thumbnails/${v.thumbnail}`,
      likes: v.likes
    })));
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching videos' });
  }
};

exports.likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ msg: 'Video not found' });
    video.likes += 1;
    await video.save();
    res.json({ likes: video.likes });
  } catch (err) {
    res.status(500).json({ msg: 'Error liking video' });
  }
};

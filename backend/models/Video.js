const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  filename: String,
  thumbnail: String,
  likes: { type: Number, default: 0 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);

const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
      maxlength: 100
    },
    filename: {
      type: String,
      required: [true, 'Video filename is required']
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail is required']
    },
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Video', videoSchema);

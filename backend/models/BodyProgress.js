const mongoose = require('mongoose');

const bodyProgressSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  weight: {
    type: Number,
  },
  height: {
    type: Number,
  },
  bmi: {
    type: Number,
  },
  bodyFat: {
    type: Number,
  },
  chest: {
    type: Number,
  },
  waist: {
    type: Number,
  },
  arms: {
    type: Number,
  },
  thighs: {
    type: Number,
  },
  notes: {
    type: String,
  },
  progressPhotos: [{
    type: String, // URL or base64
  }],
}, { timestamps: true });

module.exports = mongoose.model('BodyProgress', bodyProgressSchema);

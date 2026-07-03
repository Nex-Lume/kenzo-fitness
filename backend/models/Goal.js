const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
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
  goalType: {
    type: String,
    enum: ['Weight Loss', 'Weight Gain', 'Fat Loss', 'Muscle Gain', 'Strength'],
    required: true,
  },
  targetWeight: {
    type: Number,
  },
  progress: {
    type: Number,
    default: 0,
  },
  deadline: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Failed'],
    default: 'In Progress',
  },
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);

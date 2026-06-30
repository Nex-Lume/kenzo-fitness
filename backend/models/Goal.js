const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  type: {
    type: String,
    enum: ['Weight Loss', 'Weight Gain', 'Muscle Gain', 'Fat Loss', 'Maintain Weight'],
    required: true,
  },
  targetValue: {
    type: Number,
    required: true,
  },
  currentValue: {
    type: Number,
    required: true,
  },
  progressPercentage: {
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

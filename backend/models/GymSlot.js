const mongoose = require('mongoose');

const gymSlotSchema = new mongoose.Schema({
  slotName: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    default: 25,
  },
  status: {
    type: String,
    enum: ['active', 'disabled'],
    default: 'active',
  },
}, { timestamps: true });

module.exports = mongoose.model('GymSlot', gymSlotSchema);

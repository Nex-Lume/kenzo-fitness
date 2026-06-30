const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  specialization: {
    type: String,
  },
  experience: {
    type: Number, // Years of experience
  },
  bio: {
    type: String,
  },
  salary: {
    type: Number,
  },
  profileImage: {
    type: String, // URL or base64
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  availability: {
    type: String, // e.g., 'Morning', 'Evening', 'Full Day'
  },
  assignedMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);

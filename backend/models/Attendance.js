const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
  date: {
    type: Date, // Midnight representation of the day
    required: true,
  },
  checkIn: {
    type: Date,
  },
  checkOut: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    default: 'present',
  },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

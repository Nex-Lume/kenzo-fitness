const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GymSlot',
    required: true,
  },
  date: {
    type: Date, // Midnight representation of the day
    required: true,
  },
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'completed'],
    default: 'booked',
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);

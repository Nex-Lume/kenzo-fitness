const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  gymName: {
    type: String,
    default: 'KenzoFitness',
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  gstNumber: {
    type: String,
  },
  openingHours: {
    type: String,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);

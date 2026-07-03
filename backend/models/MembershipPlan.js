const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a plan name'],
      unique: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a plan price'],
    },
    durationInDays: {
      type: Number,
      required: [true, 'Please add plan duration in days'],
    },
    description: {
      type: String,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);

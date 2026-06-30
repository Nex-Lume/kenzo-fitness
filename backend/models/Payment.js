const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MembershipPlan',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  paymentId: {
    type: String,
  },
  orderId: {
    type: String,
  },
  signature: {
    type: String,
  },
  status: {
    type: String,
    enum: ['created', 'successful', 'failed', 'refunded'],
    default: 'created',
  },
  paymentMethod: {
    type: String,
    default: 'razorpay',
  },
  invoiceNumber: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);

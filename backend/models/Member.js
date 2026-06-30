const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please add member full name'],
    },
    email: {
      type: String,
      required: [true, 'Please add email address'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please add phone number'],
    },
    age: {
      type: Number,
      required: [true, 'Please add member age'],
    },
    gender: {
      type: String,
      required: [true, 'Please specify gender'],
      enum: ['Male', 'Female', 'Other'],
    },
    address: {
      type: String,
      required: [true, 'Please add residential address'],
    },
    emergencyContact: {
      type: String,
      required: [true, 'Please add emergency contact details (Name & Phone)'],
    },
    membershipPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
      required: [true, 'Please select a membership plan'],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid', 'pending', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'upi', 'card', 'online', 'manual'],
    },
    lastPaymentDate: {
      type: Date,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'inactive'],
      default: 'pending',
    },
    // Reference back to the User model if registered as a user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Member', memberSchema);

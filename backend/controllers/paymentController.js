const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Member = require('../models/Member');
const MembershipPlan = require('../models/MembershipPlan');
const sendEmail = require('../services/emailService');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private/Member
const createOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    const memberId = req.user._id;

    // Verify member and plan
    const member = await Member.findOne({ user: memberId });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

    const plan = await MembershipPlan.findById(planId);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    // Create Razorpay order
    const options = {
      amount: plan.price * 100, // amount in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: `receipt_${Date.now()}_${member._id}`,
    };

    const order = await razorpay.orders.create(options);

    // Save initial payment record
    const payment = await Payment.create({
      memberId: member._id,
      planId: plan._id,
      amount: plan.price,
      currency: order.currency,
      orderId: order.id,
      status: 'created'
    });

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
      paymentRecordId: payment._id,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private/Member
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, local_payment_id } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update payment record
      const payment = await Payment.findById(local_payment_id).populate('planId').populate('memberId');
      
      payment.paymentId = razorpay_payment_id;
      payment.signature = razorpay_signature;
      payment.status = 'successful';
      payment.invoiceNumber = `INV-${Date.now()}`;
      await payment.save();

      // Activate membership
      const member = await Member.findById(payment.memberId._id);
      member.status = 'active';
      member.paymentStatus = 'paid';
      member.membershipPlan = payment.planId._id;
      
      // Calculate expiry date
      const today = new Date();
      member.expiryDate = new Date(today.setDate(today.getDate() + payment.planId.durationInDays));
      await member.save();

      // Send email
      await sendEmail({
        email: req.user.email,
        subject: 'Payment Successful & Membership Activated',
        message: `Hi ${member.fullName}, your payment of ₹${payment.amount} was successful. Your invoice number is ${payment.invoiceNumber}. Your membership is now active until ${member.expiryDate.toDateString()}.`
      });

      res.json({ success: true, message: 'Payment verified and membership activated', data: payment });
    } else {
      const payment = await Payment.findById(local_payment_id);
      if (payment) {
        payment.status = 'failed';
        await payment.save();
      }
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get member payment history
// @route   GET /api/payment/history
// @access  Private/Member
const getHistory = async (req, res) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

    const payments = await Payment.find({ memberId: member._id }).populate('planId').sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all payments
// @route   GET /api/payment/all
// @access  Private/Admin
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('memberId planId').sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Invoice
// @route   GET /api/payment/invoice/:id
// @access  Private
const getInvoice = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('memberId planId');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    
    // In a real app, generate PDF here or return HTML data to frontend to generate
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getHistory,
  getAllPayments,
  getInvoice
};

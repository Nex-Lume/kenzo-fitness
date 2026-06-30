const express = require('express');
const router = express.Router();
const {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  renewMembership,
  updatePaymentStatus,
  updateProfile,
} = require('../controllers/memberController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get all members, add a member (Admin only)
router
  .route('/')
  .get(protect, adminOnly, getMembers)
  .post(protect, adminOnly, createMember);

// Member profile update
router.put('/profile', protect, updateProfile);

// Get single member, edit member, delete member
router
  .route('/:id')
  .get(protect, getMemberById)
  .put(protect, adminOnly, updateMember)
  .delete(protect, adminOnly, deleteMember);

// Renew membership
router.put('/:id/renew', protect, renewMembership);

// Update payment status (Admin only)
router.put('/:id/payment-status', protect, adminOnly, updatePaymentStatus);

module.exports = router;

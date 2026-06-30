const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getHistory,
  getAllPayments,
  getInvoice
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const auditLog = require('../middleware/auditMiddleware');

router.post('/create-order', protect, authorize('member'), createOrder);
router.post('/verify', protect, authorize('member'), auditLog('Payment Verification'), verifyPayment);
router.get('/history', protect, authorize('member'), getHistory);
router.get('/all', protect, authorize('admin', 'reception'), getAllPayments);
router.get('/invoice/:id', protect, getInvoice);

module.exports = router;

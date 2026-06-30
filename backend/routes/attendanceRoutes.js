const express = require('express');
const { 
  checkIn, 
  checkOut, 
  getMemberAttendance, 
  getAllAttendance, 
  scanQR 
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/checkin', protect, authorize('member'), checkIn);
router.post('/checkout', protect, authorize('member'), checkOut);
router.post('/scan', protect, authorize('admin', 'reception'), scanQR);
router.get('/member', protect, authorize('member'), getMemberAttendance);
router.get('/', protect, authorize('admin', 'reception'), getAllAttendance);

module.exports = router;

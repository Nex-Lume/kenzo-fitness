const express = require('express');
const { createBooking, cancelBooking, getMemberBookings, getAllBookings } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('member'), createBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.get('/member', protect, authorize('member'), getMemberBookings);
router.get('/', protect, authorize('admin'), getAllBookings);

module.exports = router;

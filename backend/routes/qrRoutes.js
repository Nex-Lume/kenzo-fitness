const express = require('express');
const router = express.Router();
const { generateQR } = require('../controllers/qrController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/:bookingId', protect, authorize('member'), generateQR);

module.exports = router;

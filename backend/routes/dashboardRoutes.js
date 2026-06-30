const express = require('express');
const router = express.Router();
const { getDashboardStats, getExpiryStats, getPeakTime } = require('../controllers/dashboardController');
const { protect, adminOnly, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/expiry', protect, getExpiryStats);
router.get('/peak-time', getPeakTime); // Public to allow peak-time display

module.exports = router;

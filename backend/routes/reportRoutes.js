const express = require('express');
const router = express.Router();
const { getRevenueReport, getMembersReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/revenue', protect, authorize('admin'), getRevenueReport);
router.get('/members', protect, authorize('admin'), getMembersReport);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  logProgress,
  getProgressHistory,
  getProgressByMember,
  updateProgress,
  deleteProgress,
  createGoal,
  getGoals
} = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Phase 4 specific progress APIs
router.get('/member/:memberId', protect, authorize('admin', 'trainer', 'member'), getProgressByMember);
router.post('/', protect, authorize('admin', 'trainer', 'member'), logProgress);
router.put('/:id', protect, authorize('admin', 'trainer'), updateProgress);
router.delete('/:id', protect, authorize('admin', 'trainer'), deleteProgress);

// Existing member-facing APIs
router.get('/', protect, authorize('member'), getProgressHistory);

// Goal APIs
router.post('/goals', protect, authorize('member'), createGoal);
router.get('/goals', protect, authorize('member'), getGoals);

module.exports = router;

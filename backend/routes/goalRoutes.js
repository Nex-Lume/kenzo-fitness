const express = require('express');
const router = express.Router();
const {
  getGoals,
  getGoalByMember,
  createGoal,
  updateGoal,
  deleteGoal
} = require('../controllers/goalController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin', 'trainer'), getGoals);
router.get('/member/:memberId', protect, authorize('admin', 'trainer', 'member'), getGoalByMember);
router.post('/', protect, authorize('admin', 'trainer'), createGoal);
router.put('/:id', protect, authorize('admin', 'trainer'), updateGoal);
router.delete('/:id', protect, authorize('admin', 'trainer'), deleteGoal);

module.exports = router;

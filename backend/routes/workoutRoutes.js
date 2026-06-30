const express = require('express');
const router = express.Router();
const {
  getWorkoutPlans,
  getWorkoutPlanByMember,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan
} = require('../controllers/workoutController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin', 'trainer'), getWorkoutPlans);
router.get('/member/:memberId', protect, authorize('admin', 'trainer', 'member'), getWorkoutPlanByMember);
router.post('/', protect, authorize('admin', 'trainer'), createWorkoutPlan);
router.put('/:id', protect, authorize('admin', 'trainer'), updateWorkoutPlan);
router.delete('/:id', protect, authorize('admin', 'trainer'), deleteWorkoutPlan);

module.exports = router;

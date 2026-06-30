const express = require('express');
const router = express.Router();
const {
  getDietPlans,
  getDietPlanByMember,
  createDietPlan,
  updateDietPlan,
  deleteDietPlan
} = require('../controllers/dietController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin', 'trainer'), getDietPlans);
router.get('/member/:memberId', protect, authorize('admin', 'trainer', 'member'), getDietPlanByMember);
router.post('/', protect, authorize('admin', 'trainer'), createDietPlan);
router.put('/:id', protect, authorize('admin', 'trainer'), updateDietPlan);
router.delete('/:id', protect, authorize('admin', 'trainer'), deleteDietPlan);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getTrainers, getTrainerById, createTrainer, assignMember, removeMember, getTrainerProfile, updateTrainer, deleteTrainer } = require('../controllers/trainerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin', 'reception', 'member'), getTrainers);
router.post('/', protect, authorize('admin'), createTrainer);
router.get('/me', protect, authorize('trainer'), getTrainerProfile);
router.get('/:id', protect, authorize('admin', 'reception'), getTrainerById);
router.put('/:id', protect, authorize('admin'), updateTrainer);
router.delete('/:id', protect, authorize('admin'), deleteTrainer);
router.put('/:id/assign-member', protect, authorize('admin'), assignMember);
router.put('/:id/assign', protect, authorize('admin'), assignMember); // alias requested by user
router.put('/:id/remove-member', protect, authorize('admin'), removeMember);

module.exports = router;

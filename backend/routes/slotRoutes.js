const express = require('express');
const { getSlots, createSlot, updateSlot, deleteSlot } = require('../controllers/slotController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getSlots)
  .post(protect, authorize('admin'), createSlot);

router.route('/:id')
  .put(protect, authorize('admin'), updateSlot)
  .delete(protect, authorize('admin'), deleteSlot);

module.exports = router;

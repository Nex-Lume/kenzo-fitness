const express = require('express');
const router = express.Router();
const {
  submitMessage,
  getMessages,
  getMessage,
  updateMessageStatus,
  deleteMessage,
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', submitMessage);
router.get('/', protect, adminOnly, getMessages);
router.get('/:id', protect, adminOnly, getMessage);
router.put('/:id/status', protect, adminOnly, updateMessageStatus);
router.delete('/:id', protect, adminOnly, deleteMessage);

module.exports = router;

const BodyProgress = require('../models/BodyProgress');
const Goal = require('../models/Goal');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');

// @desc    Log new body progress
// @route   POST /api/progress
// @access  Private/Member,Trainer,Admin
const logProgress = async (req, res) => {
  try {
    let memberId = req.body.memberId;
    let trainerId = req.body.trainerId;

    if (req.user.role === 'member') {
      const member = await Member.findOne({ user: req.user._id });
      if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
      memberId = member._id;
    }

    if (req.user.role === 'trainer') {
      const trainer = await Trainer.findOne({ user: req.user._id });
      if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
      trainerId = trainer._id;
    }

    const progress = await BodyProgress.create({
      memberId,
      trainerId,
      ...req.body,
      memberId,
      trainerId
    });

    res.status(201).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get member's body progress history (self)
// @route   GET /api/progress
// @access  Private/Member
const getProgressHistory = async (req, res) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

    const history = await BodyProgress.find({ memberId: member._id })
      .populate('trainerId', 'fullName')
      .sort({ date: 1 });
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get progress entries by member ID
// @route   GET /api/progress/member/:memberId
// @access  Private/Admin,Trainer,Member
const getProgressByMember = async (req, res) => {
  try {
    const history = await BodyProgress.find({ memberId: req.params.memberId })
      .populate('trainerId', 'fullName')
      .sort({ date: 1 });
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a progress entry
// @route   PUT /api/progress/:id
// @access  Private/Admin,Trainer
const updateProgress = async (req, res) => {
  try {
    const progress = await BodyProgress.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!progress) return res.status(404).json({ success: false, message: 'Progress entry not found' });
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a progress entry
// @route   DELETE /api/progress/:id
// @access  Private/Admin,Trainer
const deleteProgress = async (req, res) => {
  try {
    const progress = await BodyProgress.findByIdAndDelete(req.params.id);
    if (!progress) return res.status(404).json({ success: false, message: 'Progress entry not found' });
    res.json({ success: true, message: 'Progress entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new goal
// @route   POST /api/progress/goals
// @access  Private/Member
const createGoal = async (req, res) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

    const goal = await Goal.create({
      memberId: member._id,
      ...req.body
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get member's goals
// @route   GET /api/progress/goals
// @access  Private/Member
const getGoals = async (req, res) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

    const goals = await Goal.find({ memberId: member._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  logProgress,
  getProgressHistory,
  getProgressByMember,
  updateProgress,
  deleteProgress,
  createGoal,
  getGoals
};

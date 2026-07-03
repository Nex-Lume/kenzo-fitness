const Goal = require('../models/Goal');
const Trainer = require('../models/Trainer');

// @desc    Get all goals
// @route   GET /api/goals
// @access  Private (Admin, Trainer)
const getGoals = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'trainer') {
      const trainer = await Trainer.findOne({ user: req.user._id });
      if (trainer) query.trainerId = trainer._id;
    }

    const goals = await Goal.find(query)
      .populate('memberId', 'fullName name')
      .populate('trainerId', 'fullName');
      
    res.json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get goals by member ID
// @route   GET /api/goals/member/:memberId
// @access  Private
const getGoalByMember = async (req, res) => {
  try {
    const goals = await Goal.find({ memberId: req.params.memberId })
      .populate('trainerId', 'fullName');
    res.json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private (Trainer, Admin)
const createGoal = async (req, res) => {
  try {
    let trainerId = req.body.trainerId;
    if (req.user.role === 'trainer') {
      const trainer = await Trainer.findOne({ user: req.user._id });
      if (!trainer) return res.status(404).json({ success: false, message: 'Trainer profile not found' });
      trainerId = trainer._id;
    }

    const goal = await Goal.create({
      ...req.body,
      trainerId
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private (Trainer, Admin)
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
    res.json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private (Trainer, Admin)
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
    res.json({ success: true, message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGoals,
  getGoalByMember,
  createGoal,
  updateGoal,
  deleteGoal
};

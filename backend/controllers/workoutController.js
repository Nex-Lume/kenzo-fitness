const WorkoutPlan = require('../models/WorkoutPlan');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');

// @desc    Get all workout plans (Admin/Trainer)
// @route   GET /api/workout-plans
// @access  Private/Admin,Trainer
const getWorkoutPlans = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'trainer') {
      const trainer = await Trainer.findOne({ user: req.user._id });
      if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
      query.trainerId = trainer._id;
    }
    const plans = await WorkoutPlan.find(query)
      .populate('memberId', 'fullName email')
      .populate('trainerId', 'fullName profileImage')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get workout plans by member
// @route   GET /api/workout-plans/member/:memberId
// @access  Private
const getWorkoutPlanByMember = async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ memberId: req.params.memberId })
      .populate('trainerId', 'fullName profileImage')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new workout plan
// @route   POST /api/workout-plans
// @access  Private/Trainer,Admin
const createWorkoutPlan = async (req, res) => {
  try {
    const { memberId, planName, goal, level, startDate, endDate, exercises, status } = req.body;

    let trainerId = req.body.trainerId;
    if (req.user.role === 'trainer') {
      const trainer = await Trainer.findOne({ user: req.user._id });
      if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
      trainerId = trainer._id;
      
      // Ensure member is assigned to this trainer
      if (!trainer.assignedMembers.includes(memberId)) {
        return res.status(403).json({ success: false, message: 'Not authorized to create plan for this member' });
      }
    }

    const workoutPlan = await WorkoutPlan.create({
      memberId,
      trainerId,
      planName,
      goal,
      level,
      startDate,
      endDate,
      exercises,
      status
    });

    res.status(201).json({ success: true, data: workoutPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a workout plan
// @route   PUT /api/workout-plans/:id
// @access  Private/Trainer,Admin
const updateWorkoutPlan = async (req, res) => {
  try {
    let plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Workout plan not found' });

    if (req.user.role === 'trainer') {
      const trainer = await Trainer.findOne({ user: req.user._id });
      if (plan.trainerId.toString() !== trainer._id.toString()) {
         return res.status(403).json({ success: false, message: 'Not authorized to update this plan' });
      }
    }

    plan = await WorkoutPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a workout plan
// @route   DELETE /api/workout-plans/:id
// @access  Private/Trainer,Admin
const deleteWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Workout plan not found' });

    if (req.user.role === 'trainer') {
      const trainer = await Trainer.findOne({ user: req.user._id });
      if (plan.trainerId.toString() !== trainer._id.toString()) {
         return res.status(403).json({ success: false, message: 'Not authorized to delete this plan' });
      }
    }

    await plan.deleteOne();
    res.json({ success: true, message: 'Workout plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWorkoutPlans,
  getWorkoutPlanByMember,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan
};

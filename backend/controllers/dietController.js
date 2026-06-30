const DietPlan = require('../models/DietPlan');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');

// @desc    Get all diet plans (Admin/Trainer)
// @route   GET /api/diet-plans
// @access  Private/Admin,Trainer
const getDietPlans = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'trainer') {
      const trainer = await Trainer.findOne({ user: req.user._id });
      if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
      query.trainerId = trainer._id;
    }
    const plans = await DietPlan.find(query)
      .populate('memberId', 'fullName email')
      .populate('trainerId', 'fullName profileImage')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get diet plans by member
// @route   GET /api/diet-plans/member/:memberId
// @access  Private
const getDietPlanByMember = async (req, res) => {
  try {
    const plans = await DietPlan.find({ memberId: req.params.memberId })
      .populate('trainerId', 'fullName profileImage')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new diet plan
// @route   POST /api/diet-plans
// @access  Private/Trainer,Admin
const createDietPlan = async (req, res) => {
  try {
    const { memberId, planName, goal, calories, protein, carbs, fats, waterIntake, meals, startDate, endDate, status } = req.body;

    let trainerId = req.body.trainerId;
    if (req.user.role === 'trainer') {
      const trainer = await Trainer.findOne({ user: req.user._id });
      if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
      trainerId = trainer._id;
      
      if (!trainer.assignedMembers.includes(memberId)) {
        return res.status(403).json({ success: false, message: 'Not authorized to create plan for this member' });
      }
    }

    const dietPlan = await DietPlan.create({
      memberId,
      trainerId,
      planName,
      goal,
      calories,
      protein,
      carbs,
      fats,
      waterIntake,
      meals,
      startDate,
      endDate,
      status
    });

    res.status(201).json({ success: true, data: dietPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a diet plan
// @route   PUT /api/diet-plans/:id
// @access  Private/Trainer,Admin
const updateDietPlan = async (req, res) => {
  try {
    let plan = await DietPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Diet plan not found' });

    if (req.user.role === 'trainer') {
      const trainer = await Trainer.findOne({ user: req.user._id });
      if (plan.trainerId.toString() !== trainer._id.toString()) {
         return res.status(403).json({ success: false, message: 'Not authorized to update this plan' });
      }
    }

    plan = await DietPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a diet plan
// @route   DELETE /api/diet-plans/:id
// @access  Private/Trainer,Admin
const deleteDietPlan = async (req, res) => {
  try {
    const plan = await DietPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Diet plan not found' });

    if (req.user.role === 'trainer') {
      const trainer = await Trainer.findOne({ user: req.user._id });
      if (plan.trainerId.toString() !== trainer._id.toString()) {
         return res.status(403).json({ success: false, message: 'Not authorized to delete this plan' });
      }
    }

    await plan.deleteOne();
    res.json({ success: true, message: 'Diet plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDietPlans,
  getDietPlanByMember,
  createDietPlan,
  updateDietPlan,
  deleteDietPlan
};

const MembershipPlan = require('../models/MembershipPlan');

// @desc    Get all plans
// @route   GET /api/plans
// @access  Public
const getPlans = async (req, res, next) => {
  try {
    const query = req.query.includeInactive === 'true' ? {} : { isActive: true };
    const plans = await MembershipPlan.find(query).sort({ price: 1 });
    return res.json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    next(error);
  }
};

// @desc    Create membership plan
// @route   POST /api/plans
// @access  Private/Admin
const createPlan = async (req, res) => {
  try {
    const { name, price, durationInDays, features, isActive } = req.body;

    const planExists = await MembershipPlan.findOne({ name });
    if (planExists) {
      return res.status(400).json({ success: false, message: 'Plan name already exists' });
    }

    const plan = await MembershipPlan.create({
      name,
      price,
      durationInDays,
      features: features || [],
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({ success: true, data: plan });
  } catch (error) {
    console.error('Error creating plan:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update membership plan
// @route   PUT /api/plans/:id
// @access  Private/Admin
const updatePlan = async (req, res) => {
  try {
    const { name, price, durationInDays, features, isActive } = req.body;

    let plan = await MembershipPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Membership plan not found' });
    }

    // Name uniqueness check if updating name
    if (name && name !== plan.name) {
      const nameTaken = await MembershipPlan.findOne({ name });
      if (nameTaken) {
        return res.status(400).json({ success: false, message: 'Plan name already exists' });
      }
    }

    plan = await MembershipPlan.findByIdAndUpdate(
      req.params.id,
      {
        name: name || plan.name,
        price: price !== undefined ? price : plan.price,
        durationInDays: durationInDays !== undefined ? durationInDays : plan.durationInDays,
        features: features || plan.features,
        isActive: isActive !== undefined ? isActive : plan.isActive,
      },
      { new: true, runValidators: true }
    );

    return res.json({ success: true, data: plan });
  } catch (error) {
    console.error('Error updating plan:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete membership plan
// @route   DELETE /api/plans/:id
// @access  Private/Admin
const deletePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Membership plan not found' });
    }

    await MembershipPlan.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Membership plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
};

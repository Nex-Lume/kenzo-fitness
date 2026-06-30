const Setting = require('../models/Setting');

// @desc    Get Gym Settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({}); // Create default if missing
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Gym Settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }

    const updated = await Setting.findByIdAndUpdate(settings._id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Settings updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};

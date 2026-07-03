const Trainer = require('../models/Trainer');
const User = require('../models/User');

// @desc    Get all trainers
// @route   GET /api/trainers
// @access  Private
const getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().populate('user', 'name email phone').populate('assignedMembers', 'fullName email phone status');
    res.json({ success: true, data: trainers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trainer by ID
// @route   GET /api/trainers/:id
// @access  Private/Admin
const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id).populate('user', 'name email phone').populate('assignedMembers', 'fullName email phone status');
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    res.json({ success: true, data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new trainer
// @route   POST /api/trainers
// @access  Private/Admin
const createTrainer = async (req, res) => {
  try {
    const { fullName, email, phone, gender, dob, qualifications, joiningDate, specialization, experience, bio, salary, profileImage, availability, status } = req.body;

    // Create user account first
    const user = await User.create({
      name: fullName,
      email,
      phone,
      password: 'trainerpassword123', // Default password
      role: 'trainer'
    });

    const trainer = await Trainer.create({
      user: user._id,
      fullName,
      email,
      phone,
      gender,
      dob,
      qualifications,
      joiningDate,
      specialization,
      experience,
      bio,
      salary,
      profileImage,
      availability,
      status
    });

    res.status(201).json({ success: true, data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign member to trainer
// @route   PUT /api/trainers/:id/assign-member
// @access  Private/Admin
const assignMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const trainer = await Trainer.findById(req.params.id);
    
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    
    if (!trainer.assignedMembers.includes(memberId)) {
      trainer.assignedMembers.push(memberId);
      await trainer.save();
    }
    
    res.json({ success: true, message: 'Member assigned successfully', data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove member from trainer
// @route   PUT /api/trainers/:id/remove-member
// @access  Private/Admin
const removeMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const trainer = await Trainer.findById(req.params.id);
    
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    
    trainer.assignedMembers = trainer.assignedMembers.filter(id => id.toString() !== memberId);
    await trainer.save();
    
    res.json({ success: true, message: 'Member removed successfully', data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trainer profile
// @route   GET /api/trainers/me
// @access  Private/Trainer
const getTrainerProfile = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user._id }).populate('assignedMembers', 'fullName email phone status membershipPlan');
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer profile not found' });
    
    res.json({ success: true, data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a trainer
// @route   PUT /api/trainers/:id
// @access  Private/Admin
const updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    
    // Also update User email/phone if changed
    if (req.body.email || req.body.phone || req.body.fullName) {
      const updateData = {};
      if (req.body.fullName) updateData.name = req.body.fullName;
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.phone) updateData.phone = req.body.phone;
      await User.findByIdAndUpdate(trainer.user, updateData);
    }
    
    res.json({ success: true, data: trainer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a trainer
// @route   DELETE /api/trainers/:id
// @access  Private/Admin
const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });
    await User.findByIdAndDelete(trainer.user);
    res.json({ success: true, message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTrainers,
  getTrainerById,
  createTrainer,
  assignMember,
  removeMember,
  getTrainerProfile,
  updateTrainer,
  deleteTrainer
};

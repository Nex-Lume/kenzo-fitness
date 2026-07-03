const Member = require('../models/Member');
const User = require('../models/User');
const MembershipPlan = require('../models/MembershipPlan');

// @desc    Get all members with filtering, search, and pagination
// @route   GET /api/members
// @access  Private/Admin
const getMembers = async (req, res, next) => {
  try {
    const { search, status, paymentStatus, plan, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (plan) query.membershipPlan = plan;

    const skip = (page - 1) * limit;
    
    const members = await Member.find(query)
      .populate('membershipPlan')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Member.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return res.json({ 
      success: true, 
      count: members.length, 
      data: members,
      total,
      page: Number(page),
      pages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Private
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate('membershipPlan');

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Allow admins to view any profile; members can only view their own profile
    if (req.user.role !== 'admin' && (!member.user || member.user.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    return res.json({ success: true, data: member });
  } catch (error) {
    console.error('Error fetching member:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create member (Admin manual addition)
// @route   POST /api/members
// @access  Private/Admin
const createMember = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      age,
      gender,
      address,
      emergencyContact,
      membershipPlan,
      paymentStatus,
      status,
      password, // Admin can set a password, otherwise default to kenzofitness123
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'A user/member with this email already exists' });
    }

    // Fetch plan details
    const plan = await MembershipPlan.findById(membershipPlan);
    if (!plan) {
      return res.status(400).json({ success: false, message: 'Selected membership plan not found' });
    }

    // Create system User account for the member
    const user = await User.create({
      name: fullName,
      email,
      password: password || 'kenzofitness123',
      phone,
      role: 'member',
    });

    // Calculate dates
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(startDate.getDate() + plan.durationInDays);

    // Create Member record
    const member = await Member.create({
      fullName,
      email,
      phone,
      age,
      gender,
      address,
      emergencyContact,
      membershipPlan: plan._id,
      startDate,
      expiryDate,
      paymentStatus: paymentStatus || 'pending',
      status: status || 'pending',
      user: user._id,
    });

    return res.status(201).json({ success: true, data: member });
  } catch (error) {
    console.error('Error creating member:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private/Admin
const updateMember = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      age,
      gender,
      address,
      emergencyContact,
      membershipPlan,
      paymentStatus,
      status,
      startDate,
    } = req.body;

    let member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Keep email unique check if updating email
    if (email && email !== member.email) {
      const emailTaken = await Member.findOne({ email });
      if (emailTaken) {
        return res.status(400).json({ success: false, message: 'Email already taken by another member' });
      }
    }

    // Prepare fields to update
    const updateFields = {
      fullName: fullName || member.fullName,
      email: email || member.email,
      phone: phone || member.phone,
      age: age || member.age,
      gender: gender || member.gender,
      address: address || member.address,
      emergencyContact: emergencyContact || member.emergencyContact,
      paymentStatus: paymentStatus || member.paymentStatus,
      status: status || member.status,
    };

    // If starting date is specified or modified
    if (startDate) {
      updateFields.startDate = new Date(startDate);
    }

    // Handle Membership Plan updates or recalculations
    if (membershipPlan && membershipPlan.toString() !== member.membershipPlan.toString()) {
      const plan = await MembershipPlan.findById(membershipPlan);
      if (!plan) {
        return res.status(400).json({ success: false, message: 'Selected membership plan not found' });
      }
      updateFields.membershipPlan = plan._id;

      // Recalculate expiry date from start date
      const sDate = updateFields.startDate || member.startDate;
      const expiry = new Date(sDate);
      expiry.setDate(expiry.getDate() + plan.durationInDays);
      updateFields.expiryDate = expiry;
    } else if (startDate) {
      // If plan is the same but start date changed, update expiry date as well
      const plan = await MembershipPlan.findById(member.membershipPlan);
      if (plan) {
        const expiry = new Date(updateFields.startDate);
        expiry.setDate(expiry.getDate() + plan.durationInDays);
        updateFields.expiryDate = expiry;
      }
    }

    // Apply updates to Member
    member = await Member.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    }).populate('membershipPlan');

    // Propagate changes to User Auth database record
    if (member.user) {
      const userUpdate = {};
      if (fullName) userUpdate.name = fullName;
      if (email) userUpdate.email = email;
      if (phone) userUpdate.phone = phone;

      await User.findByIdAndUpdate(member.user, userUpdate);
    }

    return res.json({ success: true, data: member });
  } catch (error) {
    console.error('Error updating member:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private/Admin
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Delete linked User authentication account
    if (member.user) {
      await User.findByIdAndDelete(member.user);
    }

    // Delete the member record
    await Member.findByIdAndDelete(req.params.id);

    return res.json({ success: true, message: 'Member and linked auth account deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Renew membership
// @route   PUT /api/members/:id/renew
// @access  Private
const renewMembership = async (req, res, next) => {
  try {
    const { membershipPlan, paymentStatus, startDate } = req.body;
    let member = await Member.findById(req.params.id);

    if (!member) {
      res.status(404);
      throw new Error('Member not found');
    }

    if (req.user.role !== 'admin' && member.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Access denied');
    }

    const plan = await MembershipPlan.findById(membershipPlan);
    if (!plan) {
      res.status(400);
      throw new Error('Selected membership plan not found');
    }

    const sDate = startDate ? new Date(startDate) : new Date();
    const expiry = new Date(sDate);
    expiry.setDate(expiry.getDate() + plan.durationInDays);

    const pStatus = paymentStatus || 'pending';
    const mStatus = pStatus === 'paid' ? 'active' : member.status;

    member = await Member.findByIdAndUpdate(
      req.params.id,
      {
        membershipPlan: plan._id,
        startDate: sDate,
        expiryDate: expiry,
        paymentStatus: pStatus,
        status: mStatus,
      },
      { new: true, runValidators: true }
    ).populate('membershipPlan');

    res.status(200).json({
      success: true,
      message: 'Membership renewed successfully',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status
// @route   PUT /api/members/:id/payment-status
// @access  Private/Admin
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus, paymentMethod, amountPaid } = req.body;
    let member = await Member.findById(req.params.id);

    if (!member) {
      res.status(404);
      throw new Error('Member not found');
    }

    let mStatus = member.status;
    let lastPaymentDate = member.lastPaymentDate;

    if (paymentStatus === 'paid') {
      mStatus = 'active';
      lastPaymentDate = new Date();
    } else if (paymentStatus === 'failed' || paymentStatus === 'unpaid') {
      mStatus = 'inactive';
    }

    member = await Member.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus,
        paymentMethod,
        amountPaid: amountPaid || member.amountPaid,
        status: mStatus,
        lastPaymentDate,
      },
      { new: true, runValidators: true }
    ).populate('membershipPlan');

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update member profile
// @route   PUT /api/members/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, age, gender, address, emergencyContact } = req.body;
    
    let member = await Member.findOne({ user: req.user._id });
    if (!member) {
      res.status(404);
      throw new Error('Member profile not found');
    }

    member = await Member.findByIdAndUpdate(
      member._id,
      { fullName, phone, age, gender, address, emergencyContact },
      { new: true, runValidators: true }
    ).populate('membershipPlan');

    if (fullName || phone) {
      const userUpdate = {};
      if (fullName) userUpdate.name = fullName;
      if (phone) userUpdate.phone = phone;
      await User.findByIdAndUpdate(req.user._id, userUpdate);
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update member fitness profile
// @route   PUT /api/members/fitness-profile
// @access  Private
const updateFitnessProfile = async (req, res, next) => {
  try {
    const { fitnessLevel, medicalConditions, allergies, bloodGroup, emergencyContact, lifestyle, workoutExperience, currentInjuries } = req.body;
    
    let member = await Member.findOne({ user: req.user._id });
    if (!member) {
      res.status(404);
      throw new Error('Member not found');
    }

    member.fitnessProfile = {
      fitnessLevel,
      medicalConditions,
      allergies,
      bloodGroup,
      emergencyContact,
      lifestyle,
      workoutExperience,
      currentInjuries
    };

    await member.save();

    res.status(200).json({
      success: true,
      message: 'Fitness profile updated successfully',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  renewMembership,
  updatePaymentStatus,
  updateProfile,
  updateFitnessProfile,
};

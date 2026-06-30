const User = require('../models/User');
const Member = require('../models/Member');
const MembershipPlan = require('../models/MembershipPlan');
const jwt = require('jsonwebtoken');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user & create member details if member role
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role, // admin or member
      // Member specific details (if registering a member)
      age,
      gender,
      address,
      emergencyContact,
      membershipPlan,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const finalRole = role || 'member';

    // Create the User
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: finalRole,
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid user data' });
    }

    // If it's a member, create their corresponding Member profile
    if (finalRole === 'member') {
      if (!membershipPlan) {
        return res.status(400).json({ success: false, message: 'Please select a membership plan for admission' });
      }

      // Fetch active membership plan details
      const plan = await MembershipPlan.findById(membershipPlan);
      if (!plan) {
        return res.status(400).json({ success: false, message: 'Membership plan not found' });
      }

      // Calculate start and expiry dates
      const startDate = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(startDate.getDate() + plan.durationInDays);

      // Create the Member record
      const member = await Member.create({
        fullName: name,
        email,
        phone,
        age: age || 18,
        gender: gender || 'Other',
        address: address || 'N/A',
        emergencyContact: emergencyContact || 'N/A',
        membershipPlan: plan._id,
        startDate,
        expiryDate,
        paymentStatus: 'pending',
        status: 'pending', // Pending admin approval
        user: user._id,
      });

      return res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
        member,
      });
    }

    // If registered as admin
    return res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    // If member, look up member record
    let member = null;
    if (user.role === 'member') {
      member = await Member.findOne({ user: user._id }).populate('membershipPlan');
    }

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      member,
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile details
// @route   GET /api/auth/me
// @access  Private
const me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let member = null;
    if (user.role === 'member') {
      member = await Member.findOne({ user: user._id }).populate('membershipPlan');
    }

    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      member,
    });
  } catch (error) {
    console.error('Profile Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  me,
};

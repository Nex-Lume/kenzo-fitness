const Member = require('../models/Member');

const Booking = require('../models/Booking');
const GymSlot = require('../models/GymSlot');
const Attendance = require('../models/Attendance');
const Trainer = require('../models/Trainer');

// @desc    Get dashboard metrics & recent members
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // 1. Total members count
    const totalMembers = await Member.countDocuments();

    // 2. Active members count
    const activeMembers = await Member.countDocuments({ status: 'active' });

    // 3. Pending admissions count
    const pendingAdmissions = await Member.countDocuments({ status: 'pending' });

    // 4. Total revenue: sum of plans for all active members
    // We populate plan, and then calculate sum
    const activeMemberDetails = await Member.find({ status: 'active' }).populate('membershipPlan');
    let totalRevenue = 0;
    activeMemberDetails.forEach((member) => {
      if (member.membershipPlan && member.membershipPlan.price) {
        totalRevenue += member.membershipPlan.price;
      }
    });

    // 5. Recent admissions: 5 most recent members
    const recentAdmissions = await Member.find()
      .populate('membershipPlan')
      .sort({ createdAt: -1 })
      .limit(5);

    // 6. Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayBookings = await Booking.countDocuments({ date: today, status: 'booked' });
    const todayAttendance = await Attendance.countDocuments({ date: today, status: 'present' });

    // 7. Trainer Stats
    const activeTrainers = await Trainer.countDocuments({ status: 'active' });
    const inactiveTrainers = await Trainer.countDocuments({ status: 'inactive' });

    return res.json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        pendingAdmissions,
        totalRevenue,
        recentAdmissions,
        todayBookings,
        todayAttendance,
        activeTrainers,
        inactiveTrainers
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get membership expiry stats
// @route   GET /api/dashboard/expiry
// @access  Private
const getExpiryStats = async (req, res) => {
  try {
    const today = new Date();
    
    // Calculate dates
    const in7Days = new Date(today);
    in7Days.setDate(today.getDate() + 7);
    
    const in15Days = new Date(today);
    in15Days.setDate(today.getDate() + 15);
    
    const in30Days = new Date(today);
    in30Days.setDate(today.getDate() + 30);

    const expiredMembers = await Member.find({ expiryDate: { $lt: today }, status: 'active' }).populate('membershipPlan');
    const within7Days = await Member.find({ expiryDate: { $gte: today, $lt: in7Days }, status: 'active' }).populate('membershipPlan');
    const within15Days = await Member.find({ expiryDate: { $gte: in7Days, $lt: in15Days }, status: 'active' }).populate('membershipPlan');
    const within30Days = await Member.find({ expiryDate: { $gte: in15Days, $lt: in30Days }, status: 'active' }).populate('membershipPlan');
    
    // Also send an aggregate array for table display
    const allExpiring = await Member.find({ expiryDate: { $lt: in30Days }, status: 'active' }).populate('membershipPlan').sort({ expiryDate: 1 });

    return res.json({
      success: true,
      data: {
        expired: expiredMembers,
        in7Days: within7Days,
        in15Days: within15Days,
        in30Days: within30Days,
        allExpiring,
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get peak time occupancy
// @route   GET /api/dashboard/peak-time
// @access  Public/Private
const getPeakTime = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const slots = await GymSlot.find({ status: 'active' }).sort({ startTime: 1 });
    const slotsData = await Promise.all(slots.map(async (slot) => {
      const bookedCount = await Booking.countDocuments({
        slot: slot._id,
        date: today,
        status: 'booked'
      });
      
      const occupancy = slot.capacity > 0 ? (bookedCount / slot.capacity) * 100 : 0;
      let status = 'Low';
      if (occupancy >= 71) status = 'Peak';
      else if (occupancy >= 41) status = 'Medium';
      
      return {
        ...slot.toObject(),
        bookedCount,
        occupancy,
        status
      };
    }));
    
    return res.json({ success: true, data: slotsData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getExpiryStats,
  getPeakTime,
};

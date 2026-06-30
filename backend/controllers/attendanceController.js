const Attendance = require('../models/Attendance');
const Booking = require('../models/Booking');
const Member = require('../models/Member');

// @desc    Scan QR and automatically mark attendance
// @route   POST /api/attendance/scan
// @access  Private/Reception/Admin
exports.scanQR = async (req, res) => {
  try {
    const { qrData } = req.body;
    if (!qrData) return res.status(400).json({ success: false, message: 'No QR data provided' });

    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid QR format' });
    }

    const { bookingId } = parsedData;
    const booking = await Booking.findById(bookingId).populate('slot');
    
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status !== 'booked') return res.status(400).json({ success: false, message: 'Booking is not active' });

    // Check if attendance already exists
    const existing = await Attendance.findOne({ booking: booking._id });
    if (existing) {
      if (existing.status === 'present') {
         // If already checked in, check them out
         existing.checkOutTime = Date.now();
         existing.status = 'completed';
         await existing.save();
         return res.json({ success: true, message: 'Checked out successfully', data: existing });
      }
      return res.status(400).json({ success: false, message: 'Attendance already completed for this booking' });
    }

    // Check in
    const attendance = await Attendance.create({
      member: booking.member,
      booking: booking._id,
      date: booking.date,
      checkInTime: Date.now(),
      status: 'present'
    });

    res.json({ success: true, message: 'Checked in successfully', data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check In a member
// @route   POST /api/attendance/checkin
// @access  Private/Member
exports.checkIn = async (req, res, next) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member profile not found' });
    }

    // Build today's date boundaries in UTC
    const now = new Date();
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const todayEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

    // Find if member has a booking for today
    const booking = await Booking.findOne({
      member: member._id,
      date: { $gte: todayStart, $lte: todayEnd },
      status: 'booked'
    });

    if (!booking) {
      return res.status(400).json({ success: false, message: 'You must have a valid booking for today to check in' });
    }

    // Check if already checked in today
    let attendance = await Attendance.findOne({
      member: member._id,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    if (attendance) {
      return res.status(400).json({ success: false, message: 'You have already checked in today' });
    }

    attendance = await Attendance.create({
      member: member._id,
      booking: booking._id,
      date: todayStart,
      checkIn: new Date(),
      status: 'present'
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

// @desc    Check Out a member
// @route   POST /api/attendance/checkout
// @access  Private/Member
exports.checkOut = async (req, res, next) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member profile not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      member: member._id,
      date: today
    });

    if (!attendance) {
      return res.status(400).json({ success: false, message: 'No check-in record found for today' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ success: false, message: 'You have already checked out today' });
    }

    attendance.checkOut = new Date();
    await attendance.save();

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

// @desc    Get member's attendance
// @route   GET /api/attendance/member
// @access  Private/Member
exports.getMemberAttendance = async (req, res, next) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member profile not found' });
    }

    const attendances = await Attendance.find({ member: member._id })
      .populate('booking')
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: attendances });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all attendance (Admin)
// @route   GET /api/attendance
// @access  Private/Admin
exports.getAllAttendance = async (req, res, next) => {
  try {
    const { date, memberId } = req.query;
    let query = {};
    
    if (date) {
      // Parse as UTC to avoid timezone drift — treat the date string as UTC midnight
      const [year, month, day] = date.split('-').map(Number);
      const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
      query.date = { $gte: start, $lte: end };
    }

    if (memberId) {
      query.member = memberId;
    }

    const attendances = await Attendance.find(query)
      .populate('member', 'fullName email phone')
      .populate({
        path: 'booking',
        populate: [
          { path: 'slot' },
          { path: 'member', select: 'fullName email phone' }
        ]
      })
      .sort({ date: -1 });

    // Normalize: if direct member populate is null (orphaned ref), use booking.member as fallback
    const normalized = attendances.map(a => {
      const doc = a.toObject();
      if (!doc.member && doc.booking && doc.booking.member) {
        doc.member = doc.booking.member;
      }
      return doc;
    });

    res.status(200).json({ success: true, data: normalized });
  } catch (error) {
    next(error);
  }
};

const Booking = require('../models/Booking');
const Member = require('../models/Member');
const GymSlot = require('../models/GymSlot');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private/Member
exports.createBooking = async (req, res, next) => {
  try {
    const { slotId, date } = req.body; // date expected in YYYY-MM-DD
    
    // Find member associated with logged in user
    const member = await Member.findOne({ user: req.user._id });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member profile not found' });
    }

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Only future or today dates can be booked
    if (bookingDate < today) {
      return res.status(400).json({ success: false, message: 'Cannot book for a past date' });
    }

    // A member can only book one slot per day
    const existingBooking = await Booking.findOne({
      member: member._id,
      date: bookingDate,
      status: 'booked',
    });

    if (existingBooking) {
      return res.status(400).json({ success: false, message: 'You already have a booking for this date' });
    }

    const slot = await GymSlot.findById(slotId);
    if (!slot || slot.status === 'disabled') {
      return res.status(400).json({ success: false, message: 'Slot not found or disabled' });
    }

    // Check capacity
    const bookedCount = await Booking.countDocuments({
      slot: slot._id,
      date: bookingDate,
      status: 'booked',
    });

    if (bookedCount >= slot.capacity) {
      return res.status(400).json({ success: false, message: 'Slot is fully booked' });
    }

    const booking = await Booking.create({
      member: member._id,
      slot: slot._id,
      date: bookingDate,
      status: 'booked',
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (req.user.role !== 'admin') {
      const member = await Member.findOne({ user: req.user._id });
      if (!member || booking.member.toString() !== member._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get member's bookings
// @route   GET /api/bookings/member
// @access  Private/Member
exports.getMemberBookings = async (req, res, next) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member profile not found' });
    }

    const bookings = await Booking.find({ member: member._id })
      .populate('slot')
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const { date } = req.query;
    let query = {};
    if (date) {
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      query.date = queryDate;
    }

    const bookings = await Booking.find(query)
      .populate('member', 'fullName email phone')
      .populate('slot')
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

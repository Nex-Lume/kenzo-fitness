const GymSlot = require('../models/GymSlot');
const Booking = require('../models/Booking');

// @desc    Get all slots (with booking counts for a specific date)
// @route   GET /api/slots
// @access  Public/Private
exports.getSlots = async (req, res, next) => {
  try {
    const { date } = req.query; // format: YYYY-MM-DD
    const slots = await GymSlot.find();

    if (!date) {
      return res.status(200).json({ success: true, data: slots });
    }

    // If date is provided, return slots with booking counts
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const slotsWithCounts = await Promise.all(
      slots.map(async (slot) => {
        const bookedCount = await Booking.countDocuments({
          slot: slot._id,
          date: queryDate,
          status: 'booked'
        });
        return {
          ...slot.toObject(),
          bookedCount,
          availableSeats: slot.capacity - bookedCount,
        };
      })
    );

    res.status(200).json({ success: true, data: slotsWithCounts });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new slot
// @route   POST /api/slots
// @access  Admin
exports.createSlot = async (req, res, next) => {
  try {
    const { slotName, startTime, endTime, capacity } = req.body;
    const slot = await GymSlot.create({ slotName, startTime, endTime, capacity });
    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a slot
// @route   PUT /api/slots/:id
// @access  Admin
exports.updateSlot = async (req, res, next) => {
  try {
    const slot = await GymSlot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }
    res.status(200).json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a slot
// @route   DELETE /api/slots/:id
// @access  Admin
exports.deleteSlot = async (req, res, next) => {
  try {
    const slot = await GymSlot.findByIdAndDelete(req.params.id);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

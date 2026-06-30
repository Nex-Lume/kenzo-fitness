const ContactMessage = require('../models/ContactMessage');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
exports.submitMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      res.status(400);
      throw new Error('Please fill all required fields');
    }

    const contact = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Contact message submitted successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      message: 'Messages fetched successfully',
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    
    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    res.status(200).json({
      success: true,
      message: 'Message fetched successfully',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update message status
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
exports.updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'read', 'replied'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    res.status(200).json({
      success: true,
      message: 'Message status updated successfully',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

const Payment = require('../models/Payment');
const Member = require('../models/Member');
const Booking = require('../models/Booking');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// Helper to handle export formats
const handleExport = (res, data, type, filename) => {
  if (type === 'csv') {
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${filename}.csv`);
    return res.send(csv);
  } else if (type === 'pdf') {
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}.pdf`);
    doc.pipe(res);
    doc.fontSize(20).text(`KenzoFitness ${filename} Report`, { align: 'center' });
    doc.moveDown();
    
    data.forEach(item => {
      doc.fontSize(12).text(JSON.stringify(item));
      doc.moveDown();
    });
    
    doc.end();
  } else {
    // JSON default
    return res.json({ success: true, data });
  }
};

// @desc    Get Revenue Report
// @route   GET /api/reports/revenue
// @access  Private/Admin
const getRevenueReport = async (req, res) => {
  try {
    const { format } = req.query; // json, csv, pdf

    const payments = await Payment.find({ status: 'successful' })
      .populate('memberId', 'fullName email')
      .populate('planId', 'name price');

    const reportData = payments.map(p => ({
      Date: p.createdAt.toISOString().split('T')[0],
      Member: p.memberId ? p.memberId.fullName : 'N/A',
      Plan: p.planId ? p.planId.name : 'N/A',
      Amount: p.amount,
      Currency: p.currency,
      Invoice: p.invoiceNumber
    }));

    handleExport(res, reportData, format, 'RevenueReport');
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Members Report
// @route   GET /api/reports/members
// @access  Private/Admin
const getMembersReport = async (req, res) => {
  try {
    const { format } = req.query;
    const members = await Member.find().populate('membershipPlan', 'name');

    const reportData = members.map(m => ({
      Joined: m.createdAt.toISOString().split('T')[0],
      Name: m.fullName,
      Email: m.email,
      Phone: m.phone,
      Status: m.status,
      Plan: m.membershipPlan ? m.membershipPlan.name : 'N/A',
      Expiry: m.expiryDate ? m.expiryDate.toISOString().split('T')[0] : 'N/A'
    }));

    handleExport(res, reportData, format, 'MembersReport');
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRevenueReport,
  getMembersReport
};

// src/controllers/adminInvoiceController.js
const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const catchAsync = require('../utils/catchAsync');
const generateInvoicePDF = require('../utils/generateInvoicePDF');
const sendInvoiceEmail = require('../utils/sendInvoiceEmail');

const getAllInvoices = catchAsync(async (req, res) => {
  const invoices = await Invoice.find()
    .populate({
      path: 'booking',
      populate: { path: 'user vehicle', select: 'name email make model licensePlate' }
    })
    .sort({ createdAt: -1 });

  res.json(invoices);
});

const getInvoice = catchAsync(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate({
      path: 'booking',
      populate: { path: 'user vehicle' }
    });

  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  res.json(invoice);
});

// Mark invoice as sent
const markInvoiceSent = catchAsync(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

  invoice.status = 'sent';
  invoice.sentAt = new Date();
  await invoice.save();

  res.json({ message: 'Invoice marked as sent', invoice });
});

// Sync paid amount from payments
const syncInvoicePayment = catchAsync(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate('booking');
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

  const paid = await Payment.aggregate([
    { $match: { booking: invoice.booking._id, status: 'succeeded' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const paidAmount = paid[0]?.total || 0;
  invoice.paidAmount = paidAmount;

  if (paidAmount >= invoice.totalAmount) {
    invoice.status = 'paid';
    invoice.paidAt = new Date();
  }

  await invoice.save();
  await invoice.populate({
    path: 'booking',
    populate: { path: 'user vehicle' }
  });

  res.json({ message: 'Invoice synced', invoice });
});

const downloadInvoicePDF = catchAsync(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

  const pdfBuffer = await generateInvoicePDF(invoice);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`
  });
  res.send(pdfBuffer);
});


const emailInvoice = catchAsync(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate('booking.user');
  await sendInvoiceEmail(invoice);
  invoice.status = 'sent';
  invoice.sentAt = new Date();
  await invoice.save();

  res.json({ message: 'Invoice emailed successfully' });
});

module.exports = { getAllInvoices, getInvoice, markInvoiceSent, syncInvoicePayment, downloadInvoicePDF, emailInvoice };
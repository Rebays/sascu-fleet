const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const catchAsync = require('../utils/catchAsync');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

// Helper: Check if dates overlap
const datesOverlap = (start1, end1, start2, end2) => {
  return new Date(start1) < new Date(end2) && new Date(start2) < new Date(end1);
};

const createBooking = catchAsync(async (req, res) => {
  const { vehicleId, startDate, endDate } = req.body;
  const userId = req.user.id;

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle || !vehicle.isAvailable) {
    return res.status(400).json({ message: 'Vehicle not available' });
  }

  // Check for overlapping bookings
  const conflict = await Booking.findOne({
    vehicle: vehicleId,
    status: { $in: ['pending', 'confirmed', 'ongoing'] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
    ]
  });

  if (conflict) {
    return res.status(400).json({ message: 'Vehicle already booked for these dates' });
  }

  const hours = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60);
  const days = hours / 24;
  const totalPrice = days >= 1 ? days * vehicle.pricePerDay : hours * vehicle.pricePerHour;

  const booking = await Booking.create({
    user: userId,
    vehicle: vehicleId,
    startDate,
    endDate,
    totalPrice
  });

    // Create an invoice for the booking
    const invoice = await Invoice.create({
      booking: booking._id,
      bookingRef: booking.bookingRef,
      totalAmount: booking.totalPrice,
      dueDate: new Date(booking.startDate), // due on pickup day
      paidAmount: 0
    });

    //Attach invoice to booking
    booking.invoice = invoice._id;
    await booking.save();
    // Mark vehicle as unavailable
    await Vehicle.findByIdAndUpdate(vehicleId, { isAvailable: false });
    await booking.populate('vehicle');

  res.status(201).json(booking);
});

const getMyBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate('vehicle')
    .sort({ createdAt: -1 });

  res.json(bookings);
});

const getAllBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'name email phone')
    .populate('vehicle', 'make model licensePlate type')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

const getBookingById = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email')
    .populate('vehicle', 'make model licensePlate');

  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  res.json({ success: true, data: booking });
});

const createBookingAdmin = catchAsync(async (req, res) => {
  const booking = await Booking.create(req.body);
  const { vehicle, startDate, endDate } = req.body;

  // Check if vehicle is already booked
  const conflictingBooking = await Booking.findOne({
    vehicle,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      { startDate: { $lt: endDate }, endDate: { $gt: startDate } }
    ]
  });
  
  if (conflictingBooking) {
    return res.status(400).json({
      success: false,
      message: `Vehicle is already booked from ${new Date(conflictingBooking.startDate).toLocaleDateString()} to ${new Date(conflictingBooking.endDate).toLocaleDateString()}`
    });
  }

  await booking.populate('user vehicle');
  res.status(201).json({ success: true, data: booking });
});

const updateBookingAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { vehicle, startDate, endDate } = req.body;

  if (vehicle && (startDate || endDate)) {
    const existing = await Booking.findOne({
      _id: { $ne: id }, // exclude current booking
      vehicle,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startDate: { $lt: endDate || new Date().toISOString() }, 
          endDate: { $gt: startDate || new Date().toISOString() } }
      ]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Vehicle is already booked during this period`
      });
    }
  }
  
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('user vehicle');

  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  res.json({ success: true, data: booking });
});

const deleteBookingAdmin = catchAsync(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  res.json({ success: true, message: 'Booking deleted' });
});

const recordPayment = catchAsync(async (req, res) => {
  const { id } = req.params; // booking ID
  const { amount, paymentMethod = 'cash', notes = '' } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Valid amount is required' });
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Create separate Payment document
  const payment = await Payment.create({
    booking: booking._id,
    bookingRef: booking.bookingRef,
    amount: Number(amount),
    paymentMethod,
    status: 'succeeded',
    paidBy: req.user.id, // admin who recorded it
    notes,
  });

  // Update booking deposit & balance
  const totalPaid = await Payment.aggregate([
    { $match: { booking: booking._id, status: 'succeeded' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const paidAmount = totalPaid[0]?.total || 0;

  booking.deposit = paidAmount;
  booking.balance = booking.totalPrice - paidAmount;

  if (booking.balance <= 0) {
    booking.paymentStatus = 'paid';
  } else if (paidAmount > 0) {
    booking.paymentStatus = 'partial';
  }

  await booking.save();

  // Populate everything for frontend
  await booking.populate([
    { path: 'user', select: 'name email' },
    { path: 'vehicle', select: 'make model licensePlate images' },
  ]);

  await payment.populate('paidBy', 'name');

  res.status(201).json({
    success: true,
    message: 'Payment recorded successfully',
    data: {
      payment,
      booking
    }
  });
});

const getPayments = catchAsync(async (req, res) => {
  const { id } = req.params; // booking ID  
  const payments = await Payment.find({ booking: id })
    .populate('paidBy', 'name email')
    .sort({ createdAt: -1 });       
  res.json({ success: true, data: payments });
});

const sendInvoiceEmail = catchAsync(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id)
    .populate('user', 'name email')
    .populate('vehicle', 'make model licensePlate');

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Generate PDF
  const doc = new PDFDocument({ margin: 50 });
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', async () => {
    const pdfBuffer = Buffer.concat(buffers);

    // Create transporter (use your SMTP or Gmail)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email
    await transporter.sendMail({
      from: `"SASCU Rentals" <${process.env.SMTP_USER}>`,
      to: booking.user.email,
      cc: 'gsaemane@flysolomons.com',
      subject: `Invoice #${booking.bookingRef} - Vehicle Booking`,
      html: `
        <h2>Hi ${booking.user.name},</h2>
        <p>Thank you for your booking! Please find your invoice attached.</p>
        <p><strong>Booking Ref:</strong> ${booking.bookingRef}</p>
        <p><strong>Vehicle:</strong> ${booking.vehicle.make} ${booking.vehicle.model}</p>
        <p><strong>Total Amount:</strong> SBD${booking.totalPrice}</p>
        <p><strong>Amount Paid:</strong> SBD${booking.deposit || 0}</p>
        <p><strong>Balance Due:</strong> SBD${booking.balance || booking.totalPrice}</p>
        <br>
        <p>Best regards,<br>SASCU Rentals Team</p>
        <p>Please come back soon!</p>
      `,
      attachments: [
        {
          filename: `Invoice-${booking.bookingRef}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    res.json({ success: true, message: 'Invoice sent successfully!' });
  });

  // PDF Design
  doc.fontSize(20).text('INVOICE', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice #: ${booking.bookingRef}`);
  doc.text(`Date: ${new Date().toLocaleDateString('en-ZA')}`);
  doc.text(`Customer: ${booking.user.name}`);
  doc.text(`Email: ${booking.user.email}`);
  doc.moveDown();

  doc.text('Booking Details', { underline: true });
  doc.text(`Vehicle: ${booking.vehicle.make} ${booking.vehicle.model}`);
  doc.text(`License: ${booking.vehicle.licensePlate}`);
  doc.text(`Period: ${new Date(booking.startDate).toLocaleDateString()} → ${new Date(booking.endDate).toLocaleDateString()}`);
  doc.moveDown();

  doc.text('Payment Summary', { underline: true });
  doc.text(`Total Amount:                        SBD${booking.totalPrice.toFixed(2)}`);
  doc.text(`Amount Paid:                        - SBD${(booking.deposit || 0).toFixed(2)}`);
  doc.moveDown();
  doc.fontSize(14).text(`Balance Due:                        SBD${(booking.balance || booking.totalPrice).toFixed(2)}`, { align: 'right' });

  doc.end();
});


module.exports = { createBooking, getMyBookings, getAllBookings, getBookingById, createBookingAdmin, updateBookingAdmin, deleteBookingAdmin, recordPayment, getPayments, sendInvoiceEmail  };
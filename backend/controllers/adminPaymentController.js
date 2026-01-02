// src/controllers/adminPaymentController.js
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const catchAsync = require("../utils/catchAsync");

// ADMIN: Record a new payment (partial or full)
const recordPayment = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const { amount, paymentMethod = "manual", notes } = req.body;

  const booking = await Booking.findById(bookingId).populate("vehicle");
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const payment = await Payment.create({
    booking: booking._id,
    bookingRef: booking.bookingRef,
    amount,
    paymentMethod,
    paidBy: req.user.id,
    notes,
    status: "succeeded",
  });

  // Update booking payment status automatically
  const totalPaid = await Payment.aggregate([
    { $match: { booking: booking._id, status: "succeeded" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const paidAmount = totalPaid[0]?.total || 0;

  if (paidAmount >= booking.totalPrice) {
    booking.paymentStatus = "paid";
    booking.status = "confirmed";
  } else if (paidAmount > 0) {
    booking.paymentStatus = "partial";
  }

  await booking.save();

  await payment.populate("paidBy", "name email");
  await booking.populate("user vehicle");

  res.status(201).json({
    message: "Payment recorded",
    payment,
    booking: {
      bookingRef: booking.bookingRef,
      totalPrice: booking.totalPrice,
      paidAmount,
      balance: booking.totalPrice - paidAmount,
    },
  });
});

// Get all payments for a booking
const getPayments = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const payments = await Payment.find({ booking: bookingId })
    .populate("paidBy", "name")
    .sort({ createdAt: -1 });

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  res.json({ payments, totalPaid });
});

module.exports = { recordPayment, getPayments };

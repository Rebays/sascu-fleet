// src/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  bookingRef: { type: String, required: true }, // denormalized for fast lookup
  amount: { type: Number, required: true }, // in dollars (e.g., 250.00)
  paymentMethod: {
    type: String,
    enum: ['stripe', 'cash', 'bank_transfer', 'manual'],
    default: 'manual'
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'refunded'],
    default: 'succeeded'
  },
  stripePaymentIntentId: String,
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin who recorded it
  notes: String
}, { timestamps: true });

// Index for fast queries
paymentSchema.index({ bookingRef: 1 });
paymentSchema.index({ booking: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
// src/models/Invoice.js
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  bookingRef: { type: String, required: true },
  invoiceNumber: { type: String, unique: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  sentAt: Date,
  paidAt: Date,
  notes: String
}, { timestamps: true });

// Auto-generate invoice number
invoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
    const count = await this.constructor.countDocuments({
      invoiceNumber: new RegExp(`^INV-${date}`)
    }) + 1;
    this.invoiceNumber = `INV-${date}-${String(count).padStart(3,'0')}`;
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
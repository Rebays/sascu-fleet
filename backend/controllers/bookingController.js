const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const catchAsync = require('../utils/catchAsync');
const Invoice = require('../models/Invoice');

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


module.exports = { createBooking, getMyBookings };
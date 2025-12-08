const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Vehicle = require('../models/Vehicle');
const catchAsync = require('../utils/catchAsync');
const csv = require('fast-csv');
const moment = require('moment');

const getDashboard = catchAsync(async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
  const totalVehicles = await Vehicle.countDocuments();
  const availableVehicles = await Vehicle.countDocuments({ isAvailable: true });

  const revenueResult = await Payment.aggregate([
    { $match: { status: 'succeeded' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // Today's revenue
  const today = moment().startOf('day');
  const todayRevenue = await Payment.aggregate([
    { $match: { 
      status: 'succeeded',
      createdAt: { $gte: today.toDate() }
    }},
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.json({
    summary: {
      totalBookings,
      confirmedBookings,
      totalVehicles,
      availableVehicles,
      totalRevenue,
      todayRevenue: todayRevenue[0]?.total || 0,
      pendingPayments: await Booking.countDocuments({ paymentStatus: { $in: ['pending', 'partial'] } })
    }
  });
});

const getRevenueReport = catchAsync(async (req, res) => {
  let { startDate, endDate, groupBy = 'day' } = req.query;

  const match = { status: 'succeeded' };
  if (startDate && endDate) {
    match.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const dateFormat = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';
  const revenue = await Payment.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({ revenue });
});

const getTopVehicles = catchAsync(async (req, res) => {
  const topVehicles = await Booking.aggregate([
    { $match: { paymentStatus: 'paid' } },
    {
      $group: {
        _id: '$vehicle',
        bookings: { $sum: 1 },
        revenue: { $sum: '$totalPrice' }
      }
    },
    {
      $lookup: {
        from: 'vehicles',
        localField: '_id',
        foreignField: '_id',
        as: 'vehicle'
      }
    },
    { $unwind: '$vehicle' },
    {
      $project: {
        make: '$vehicle.make',
        model: '$vehicle.model',
        licensePlate: '$vehicle.licensePlate',
        bookings: 1,
        revenue: 1
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 }
  ]);

  res.json(topVehicles);
});

// Export bookings to CSV
const exportBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'name email')
    .populate('vehicle', 'make model licensePlate')
    .sort({ createdAt: -1 });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=bookings-report.csv');

  const csvStream = csv.format({ headers: true });
  csvStream.pipe(res);

  for (const b of bookings) {
    const paid = await Payment.aggregate([
      { $match: { booking: b._id, status: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    csvStream.write({
      Ref: b.bookingRef,
      Customer: b.user?.name || 'N/A',
      Email: b.user?.email || 'N/A',
      Vehicle: `${b.vehicle?.make || ''} ${b.vehicle?.model || ''} (${b.vehicle?.licensePlate || ''})`,
      Start: moment(b.startDate).format('YYYY-MM-DD'),
      End: moment(b.endDate).format('YYYY-MM-DD'),
      Total: b.totalPrice,
      Paid: paid[0]?.total || 0,
      Balance: b.totalPrice - (paid[0]?.total || 0),
      Status: b.status,
      Payment: b.paymentStatus,
      BookedOn: moment(b.createdAt).format('YYYY-MM-DD HH:mm')
    });
  }
  csvStream.end();
});

module.exports = {
  getDashboard,
  getRevenueReport,
  getTopVehicles,
  exportBookings
};
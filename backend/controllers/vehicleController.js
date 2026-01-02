// src/controllers/vehicleController.js
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const catchAsync = require("../utils/catchAsync");

const getVehicles = catchAsync(async (req, res) => {
  const vehicles = await Vehicle.find();
  res.json(vehicles);
});

const searchAvailableVehicles = catchAsync(async (req, res) => {
  const { startDate, endDate, type } = req.query;

  const query = {};
  if (type) query.type = type;

  const vehicles = await Vehicle.find(query);

  if (!startDate || !endDate) {
    return res.json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  }

  const bookedVehicles = await Booking.find({
    status: { $in: ["pending", "confirmed"] },
    $or: [{ startDate: { $lt: endDate }, endDate: { $gt: startDate } }],
  }).distinct("vehicle");

  const available = vehicles.filter(
    (v) => !bookedVehicles.some((id) => id.toString() === v._id.toString())
  );

  res.json({
    success: true,
    count: available.length,
    dateRange: { startDate, endDate },
    data: available,
  });
});

const getVehicleById = catchAsync(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  res.json(vehicle);
});

const createVehicle = catchAsync(async (req, res) => {
  const vehicle = await Vehicle.create(req.body);
  res.status(201).json(vehicle);
});
const updateVehicle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Prevent updating _id or other protected fields
  delete updates._id;
  delete updates.__v;
  delete updates.createdAt;

  const vehicle = await Vehicle.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!vehicle) {
    return res.status(404).json({
      message: "Vehicle not found",
    });
  }

  res.json({
    message: "Vehicle updated successfully",
    vehicle,
  });
});
const deleteVehicle = catchAsync(async (req, res) => {
  const { id } = req.params;

  const vehicle = await Vehicle.findByIdAndDelete(id);

  if (!vehicle) {
    return res.status(404).json({
      message: "Vehicle not found",
    });
  }

  // Optional: Delete images from Cloudinary if needed
  // if (vehicle.images) {
  //   vehicle.images.forEach((imageUrl) => {
  //     const publicId = imageUrl.split('/').pop().split('.')[0];
  //     cloudinary.uploader.destroy(publicId);
  //   });
  // }

  res.json({
    message: "Vehicle deleted successfully",
    vehicle,
  });
});

const getBookedDates = catchAsync(async (req, res) => {
  const { id } = req.params;

  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endRange = new Date();
  endRange.setMonth(endRange.getMonth() + 3);
  endRange.setHours(23, 59, 59, 999);

  const bookings = await Booking.find({
    vehicle: id,
    status: { $in: ["pending", "confirmed"] },
    $or: [{ startDate: { $lte: endRange }, endDate: { $gte: today } }],
  }).select("startDate endDate status bookingRef");

  res.json({
    success: true,
    data: {
      vehicleId: id,
      dateRange: { from: today, to: endRange },
      bookedDates: bookings.map((b) => ({
        startDate: b.startDate,
        endDate: b.endDate,
        status: b.status,
        bookingRef: b.bookingRef,
      })),
    },
  });
});

module.exports = {
  getVehicles,
  searchAvailableVehicles,
  getVehicleById,
  createVehicle,
  deleteVehicle,
  updateVehicle,
  getBookedDates,
};

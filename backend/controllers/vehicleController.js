// src/controllers/vehicleController.js
const Vehicle = require('../models/Vehicle');
const catchAsync = require('../utils/catchAsync');

const getVehicles = catchAsync(async (req, res) => {
  const vehicles = await Vehicle.find({ isAvailable: true });
  res.json(vehicles);
});

const getVehicleById = catchAsync(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
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
      message: 'Vehicle not found',
    });
  }

  res.json({
    message: 'Vehicle updated successfully',
    vehicle,
  });
});
const deleteVehicle = catchAsync(async (req, res) => {
  const { id } = req.params;

  const vehicle = await Vehicle.findByIdAndDelete(id);

  if (!vehicle) {
    return res.status(404).json({
      message: 'Vehicle not found',
    });
  }

  // Optional: Delete images from Cloudinary if needed
  // if (vehicle.images) { ... }

  res.json({
    message: 'Vehicle deleted successfully',
    vehicle,
  });
});

module.exports = { getVehicles, getVehicleById, createVehicle,deleteVehicle,updateVehicle };
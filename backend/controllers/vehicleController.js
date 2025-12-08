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

module.exports = { getVehicles, getVehicleById, createVehicle };
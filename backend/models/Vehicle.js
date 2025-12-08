const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  type: { type: String, enum: ['car', 'bike', 'scooter', 'truck'], required: true },
  licensePlate: { type: String, required: true, unique: true },
  pricePerHour: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  location: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  image: String
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
// src/routes/vehicleRoutes.js
const express = require('express');
const { getVehicles, getVehicleById, createVehicle } = require('../controllers/vehicleController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');  // ← NEW

const router = express.Router();

router.get('/', getVehicles);
router.get('/:id', getVehicleById);

// Only admins can create vehicles
router.post('/', protect, admin, createVehicle);

module.exports = router;
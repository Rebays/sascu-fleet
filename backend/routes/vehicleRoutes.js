const express = require('express');
const { getVehicles, getVehicleById, createVehicle,updateVehicle,deleteVehicle } = require('../controllers/vehicleController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/', getVehicles);
router.get('/:id', getVehicleById);

// Only admins can CRUD vehicles
router.post('/', protect, admin, createVehicle);
router.put('/:id', protect, admin, updateVehicle);
router.delete('/:id', protect, admin, deleteVehicle);

module.exports = router;
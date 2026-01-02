const express = require("express");
const {
  getVehicles,
  searchAvailableVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getBookedDates,
} = require("../controllers/vehicleController");
const { protect } = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

router.get("/", getVehicles);
router.get("/search", searchAvailableVehicles);
router.get("/:id", getVehicleById);
router.get("/:id/booked-dates", getBookedDates);

// Only admins can CRUD vehicles
router.post("/", protect, admin, createVehicle);
router.put("/:id", protect, admin, updateVehicle);
router.delete("/:id", protect, admin, deleteVehicle);

module.exports = router;

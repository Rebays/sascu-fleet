const express = require('express');
const { createBooking, getMyBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.post('/', createBooking);
router.get('/my', getMyBookings);

module.exports = router;
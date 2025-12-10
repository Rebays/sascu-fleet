const express = require('express');
const { 
    createBooking, 
    getMyBookings, 
    getAllBookings,
    getBookingById,
    createBookingAdmin,
    updateBookingAdmin,
    deleteBookingAdmin } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.use(protect);
router.post('/', createBooking);
router.get('/my', getMyBookings);
//Admin Only -  get all bookings
router.get('/admin/all', protect, admin, getAllBookings);
router.post('/admin', protect, admin, createBookingAdmin);          
router.put('/admin/:id', protect, admin, updateBookingAdmin);       
router.delete('/admin/:id', protect, admin, deleteBookingAdmin);    

module.exports = router;
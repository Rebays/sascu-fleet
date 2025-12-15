const express = require('express');
const { 
    createBooking, 
    getMyBookings, 
    getAllBookings,
    getBookingById,
    createBookingAdmin,
    updateBookingAdmin,
    deleteBookingAdmin,
    recordPayment,
    getPayments,
    sendInvoiceEmail
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.use(protect);
router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);
//Admin Only -  get all bookings
router.get('/admin/all', protect, admin, getAllBookings);
router.post('/admin', protect, admin, createBookingAdmin);          
router.put('/admin/:id', protect, admin, updateBookingAdmin);       
router.delete('/admin/:id', protect, admin, deleteBookingAdmin);    

router.post('/admin/:id/payments', protect, admin, recordPayment);
router.get('/admin/:id/payments', protect, admin, getPayments);
router.post('/admin/:id/send-invoice', protect, admin, sendInvoiceEmail);

module.exports = router;
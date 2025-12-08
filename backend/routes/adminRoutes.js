const { recordPayment, getPayments } = require('../controllers/adminPaymentController');

router.post('/bookings/:bookingId/payments', recordPayment);
router.get('/bookings/:bookingId/payments', getPayments);
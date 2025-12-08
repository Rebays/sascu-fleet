// src/routes/adminInvoiceRoutes.js
const express = require('express');
const {
  getAllInvoices,
  getInvoice,
  markInvoiceSent,
  syncInvoicePayment,
  downloadInvoicePDF,
  emailInvoice
} = require('../controllers/adminInvoiceController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();
router.use(protect, admin);

router.get('/', getAllInvoices);
router.get('/:id', getInvoice);
router.patch('/:id/sent', markInvoiceSent);
router.post('/:id/sync-payment', syncInvoicePayment);
router.get('/:id/pdf', downloadInvoicePDF);
router.post('/:id/email', emailInvoice);

module.exports = router;
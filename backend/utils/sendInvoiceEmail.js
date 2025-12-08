const nodemailer = require('nodemailer');
const generateInvoicePDF = require('./generateInvoicePDF');

const sendInvoiceEmail = async (invoice) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  const pdf = await generateInvoicePDF(invoice);

  await transporter.sendMail({
    from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
    to: invoice.booking.user.email,
    subject: `Invoice ${invoice.invoiceNumber} - ${process.env.COMPANY_NAME}`,
    html: `<p>Dear ${invoice.booking.user.name},</p><p>Please find your invoice attached.</p>`,
    attachments: [{ filename: `${invoice.invoiceNumber}.pdf`, content: pdf }]
  });
};

module.exports = sendInvoiceEmail;
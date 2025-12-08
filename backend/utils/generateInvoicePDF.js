const puppeteer = require('puppeteer');

const generateInvoicePDF = async (invoice) => {
  await invoice.populate({
    path: 'booking',
    populate: { path: 'user vehicle' }
  });

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
      .header { text-align: center; margin-bottom: 40px; }
      .invoice-box { border: 1px solid #eee; padding: 30px; border-radius: 10px; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
      th { background-color: #f4f4f4; }
      .total { font-size: 1.4em; font-weight: bold; }
      .footer { margin-top: 50px; text-align: center; color: #777; font-size: 0.9em; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>INVOICE</h1>
      <h2>${process.env.COMPANY_NAME || 'Speedy Rentals'}</h2>
    </div>
    <div class="invoice-box">
      <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
      <p><strong>Booking Ref:</strong> ${invoice.bookingRef}</p>
      <p><strong>Issue Date:</strong> ${new Date(invoice.issueDate).toLocaleDateString()}</p>
      <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
      <br/>
      <p><strong>Bill To:</strong> ${invoice.booking.user.name} (${invoice.booking.user.email})</p>

      <table>
        <tr><th>Description</th><th>Vehicle</th><th>Period</th><th>Amount</th></tr>
        <tr>
          <td>Vehicle Rental</td>
          <td>${invoice.booking.vehicle.make} ${invoice.booking.vehicle.model}<br/>${invoice.booking.vehicle.licensePlate}</td>
          <td>${new Date(invoice.booking.startDate).toLocaleDateString()} → ${new Date(invoice.booking.endDate).toLocaleDateString()}</td>
          <td>$${invoice.totalAmount.toFixed(2)}</td>
        </tr>
        <tr class="total">
          <td colspan="3"><strong>Total Due</strong></td>
          <td><strong>$${invoice.totalAmount.toFixed(2)}</strong></td>
        </tr>
        <tr>
          <td colspan="3">Paid to Date</td>
          <td>$${invoice.paidAmount.toFixed(2)}</td>
        </tr>
        <tr style="background:#fff2f2;">
          <td colspan="3"><strong>Balance Due</strong></td>
          <td><strong>$${(invoice.totalAmount - invoice.paidAmount).toFixed(2)}</strong></td>
        </tr>
      </table>
      <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
    </div>
    <div class="footer">
      Thank you for your business!<br/>
      ${process.env.COMPANY_ADDRESS || '123 Rental Street, City, State'}
    </div>
  </body>
  </html>`;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  return pdf;
};

module.exports = generateInvoicePDF;
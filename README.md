# SASCU Fleet Rental System API
**Full-Stack Ready • Production-Grade • Enterprise Features**

A modern, scalable **vehicle rental/booking backend** built with Node.js, Express, MongoDB, for Solomon Airlines Credit Union Fleet.

Live Demo: Coming soon  
Frontend Repo: Coming soon (NExtJs + Tailwind)

## Features
- User registration & JWT authentication
- Vehicle browsing & real-time availability
- Smart booking with conflict detection
- Partial & full payments (cash, bank transfer, Stripe)
- Auto-generated references:
  - Booking: `BOOK-20251208-001`
  - Invoice: `INV-20251208-001`
- Professional invoicing system
- Branded PDF invoice generation
- Email invoices directly to customers
- Complete admin dashboard & reporting
- Revenue charts, top vehicles, CSV export
- Role-based access (user / admin)
- Clean, fully documented REST API

## Tech Stack
| Layer            | Technology                     |
|------------------|--------------------------------|
| Backend          | Node.js, Express               |
| Database         | MongoDB (Mongoose)             |
| Auth             | JWT + bcrypt                   |
| Payments         | Stripe (test & live)           |
| PDF Generation   | Puppeteer                      |
| Email            | Nodemailer                     |
| Error Handling   | Global handler + catchAsync    |
| Dev Tools        | nodemon, morgan, dotenv        |

## Quick Start (Local)
```bash
# 1. Clone repo
git clone https://github.com/yourusername/vehicle-booking-api.git
cd vehicle-booking-api

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Start MongoDB (local or Atlas)

# 5. Run server
npm run dev

Server runs at: http://localhost:5000

```

# Server
```bash
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/vehiclebooking

# JWT
JWT_SECRET=your_very_long_random_string_here_128_chars_minimum

```

# Email (Nodemailer) - for sending invoices
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourcompany@gmail.com
SMTP_PASS=your_app_password_here
```
# Company Branding (appears on invoices)
```bash
COMPANY_NAME=Speedy Vehicle Rentals
COMPANY_ADDRESS=123 Airport Road, New York, NY 10001, USA
COMPANY_EMAIL=info@speedyrentals.com
COMPANY_PHONE=+1 (555) 123-4567
```

# Frontend URL 
```bash
FRONTEND_URL=http://localhost:3000
```

#API Documentation
```bash
Full endpoint list in API_DOCS.md (updated Dec 2025)
```
#Key Endpoints:

```bash
POST   /api/auth/register
POST   /api/auth/login
GET    /api/vehicles
POST   /api/bookings
POST   /api/payments/create-checkout-session

Admin:
GET    /api/reports/dashboard
GET    /api/admin/invoices/:id/pdf
POST   /api/admin/invoices/:id/email
```

#Scripts
```bash
Bashnpm run dev     # Development with nodemon
npm start       # Production
npm run lint    # ESLint (optional)
```

## Project Structure
```bash
vehicle-booking-api/
├── .env                  # Environment variables (never commit real one)
├── .env.example          # Template for contributors
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── API_DOCS.md           # Full API documentation
└── src/
├── app.js            # Express app setup + route registration
├── server.js         # Entry point (connects DB + starts server)
│
├── config/
│   └── db.js         # MongoDB connection
│
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── vehicleController.js
│   ├── bookingController.js
│   ├── paymentController.js
│   ├── adminPaymentController.js
│   ├── reportController.js
│   ├── adminInvoiceController.js
│   └── adminInvoiceController.js
│
├── middleware/
│   ├── auth.js       # protect route + attach req.user
│   ├── admin.js      # admin-only access
│   └── errorHandler.js
│
├── models/
│   ├── User.js
│   ├── Vehicle.js
│   ├── Booking.js
│   ├── Payment.js
│   └── Invoice.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── vehicleRoutes.js
│   ├── bookingRoutes.js
│   ├── paymentRoutes.js
│   ├── adminRoutes.js
│   ├── reportRoutes.js
│   └── adminInvoiceRoutes.js
│
└── utils/
├── catchAsync.js         # Removes try/catch from controllers
├── generateInvoicePDF.js # Puppeteer PDF generator
└── sendInvoiceEmail.js   # Nodemailer helper

```
License
MIT License – free to use commercially or modify.


Author
Built with love by the Rebays Dudes
Support: dev@rebays.com.sb
Star this repo if you found it useful!


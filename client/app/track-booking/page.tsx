"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { trackBooking, type TrackingResponse } from "@/lib/api";
import { BOOKING_STATUS_DISPLAY, PAYMENT_STATUS_DISPLAY } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Search,
  User,
  Car,
  Calendar,
  DollarSign,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  Info,
  Loader2,
} from "lucide-react";

export default function TrackBookingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [bookingDetails, setBookingDetails] = useState<TrackingResponse["data"] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setBookingDetails(null);
    setLoading(true);

    try {
      const response = await trackBooking(trackingNumber.trim());
      setBookingDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to track booking. Please check your reference number.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "partial":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-muted/60 via-muted/40 to-background border-b">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Track Your Booking
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter your booking reference to view your reservation details and status
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-card border rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Search className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Enter Booking Reference</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="trackingNumber" className="text-sm font-medium mb-2 block">
                  Booking Reference Number
                </label>
                <input
                  type="text"
                  id="trackingNumber"
                  name="trackingNumber"
                  placeholder="BOOK-20260102-001"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Format: BOOK-YYYYMMDD-XXX (e.g., BOOK-20260102-001)
                </p>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Track Booking
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 bg-destructive/10 border border-destructive/50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-destructive mb-1">Error</h3>
                    <p className="text-sm text-destructive/90">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Details */}
        {bookingDetails && (
          <div className="max-w-4xl mx-auto">
            {/* Status Header */}
            <div className="bg-card border rounded-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Booking Found!</h2>
                  <p className="text-sm text-muted-foreground">
                    Reference: <span className="font-mono font-semibold text-foreground">{bookingDetails.bookingRef}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${getStatusColor(bookingDetails.status)}`}>
                    <Clock className="h-4 w-4" />
                    {BOOKING_STATUS_DISPLAY[bookingDetails.status] || bookingDetails.status}
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${getPaymentStatusColor(bookingDetails.paymentStatus)}`}>
                    <DollarSign className="h-4 w-4" />
                    {PAYMENT_STATUS_DISPLAY[bookingDetails.paymentStatus] || bookingDetails.paymentStatus}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Customer Information */}
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Customer</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">{bookingDetails.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{bookingDetails.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold">{bookingDetails.customer.phone}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Car className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Vehicle</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicle</p>
                    <p className="font-semibold">
                      {bookingDetails.vehicle.make} {bookingDetails.vehicle.model} ({bookingDetails.vehicle.year})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">License Plate</p>
                    <p className="font-semibold">{bookingDetails.vehicle.licensePlate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold">{bookingDetails.vehicle.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rental Details */}
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Rental Period</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Pickup Date</p>
                    <p className="font-semibold">{formatDate(bookingDetails.dates.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Return Date</p>
                    <p className="font-semibold">{formatDate(bookingDetails.dates.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Booked On</p>
                    <p className="font-semibold">{formatDate(bookingDetails.dates.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Payment</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="font-semibold text-lg">{formatCurrency(bookingDetails.pricing.totalPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="font-semibold">{formatCurrency(bookingDetails.pricing.deposit)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Balance Due</p>
                    <p className={`font-semibold text-lg ${bookingDetails.pricing.balance > 0 ? "text-destructive" : "text-green-600"}`}>
                      {formatCurrency(bookingDetails.pricing.balance)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-2 mb-4">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <h3 className="text-lg font-bold text-blue-900">Important Information</h3>
              </div>
              <ul className="space-y-2 text-sm text-blue-900">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Please bring a valid driver license and payment method</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Arrive 15 minutes before your pickup time</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Contact us if you need to modify your booking</span>
                </li>
                {bookingDetails.pricing.balance > 0 && (
                  <li className="flex items-start gap-2 text-red-700 font-semibold">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>
                      Outstanding balance of {formatCurrency(bookingDetails.pricing.balance)} must be paid before pickup
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-card border rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              Can&apos;t find your booking reference or having issues?
            </p>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

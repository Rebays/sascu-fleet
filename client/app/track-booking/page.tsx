"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { trackBooking, type TrackingResponse } from "@/lib/api";
import {
  BOOKING_STATUS_DISPLAY,
  PAYMENT_STATUS_DISPLAY,
} from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import Breadcrumb from "@/components/Breadcrumb";
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
  ArrowRight,
  Mail,
  Phone,
} from "lucide-react";

export default function TrackBookingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [bookingDetails, setBookingDetails] = useState<
    TrackingResponse["data"] | null
  >(null);
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
      setError(
        err.message ||
          "Failed to track booking. Please check your reference number."
      );
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
              Enter your booking reference to view your reservation details and
              status
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={[{ label: "Track Booking" }]} />
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-card border rounded-lg p-8 md:p-10">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Find Your Booking</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="trackingNumber"
                  className="text-sm font-medium mb-3 block"
                >
                  Booking Reference Number
                </label>
                <input
                  type="text"
                  id="trackingNumber"
                  name="trackingNumber"
                  placeholder="BOOK-20260102-001"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Format: BOOK-YYYYMMDD-XXX (e.g., BOOK-20260102-001)
                </p>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Track My Booking
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 bg-destructive/10 border border-destructive/50 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-destructive mb-1">
                      Booking Not Found
                    </h3>
                    <p className="text-sm text-destructive/90">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Details */}
        {bookingDetails && (
          <div className="max-w-5xl mx-auto">
            {/* Status Header */}
            <div className="bg-card border rounded-lg p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <h2 className="text-3xl font-bold">Booking Found!</h2>
                  </div>
                  <div className="bg-muted/40 border rounded-lg p-4 inline-block">
                    <p className="text-xs text-muted-foreground mb-1">
                      Reference Number
                    </p>
                    <p className="text-2xl font-mono font-bold text-foreground tracking-wide">
                      {bookingDetails.bookingRef}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold ${getStatusColor(
                      bookingDetails.status
                    )}`}
                  >
                    <Clock className="h-5 w-5" />
                    <div>
                      <p className="text-xs opacity-80">Booking Status</p>
                      <p>
                        {BOOKING_STATUS_DISPLAY[bookingDetails.status] ||
                          bookingDetails.status}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold ${getPaymentStatusColor(
                      bookingDetails.paymentStatus
                    )}`}
                  >
                    <DollarSign className="h-5 w-5" />
                    <div>
                      <p className="text-xs opacity-80">Payment Status</p>
                      <p>
                        {PAYMENT_STATUS_DISPLAY[bookingDetails.paymentStatus] ||
                          bookingDetails.paymentStatus}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Customer Information */}
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">Customer Details</h3>
                </div>
                <div className="space-y-4">
                  <div className="pb-3 border-b">
                    <p className="text-xs text-muted-foreground mb-1">Name</p>
                    <p className="font-semibold">
                      {bookingDetails.customer.name}
                    </p>
                  </div>
                  <div className="pb-3 border-b">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      {/* <Mail className="h-3 w-3" /> */}
                      Email
                    </p>
                    <p className="font-semibold text-sm break-all">
                      {bookingDetails.customer.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      {/* <Phone className="h-3 w-3" /> */}
                      Phone
                    </p>
                    <p className="font-semibold">
                      {bookingDetails.customer.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">Vehicle Details</h3>
                </div>
                <div className="space-y-4">
                  <div className="pb-3 border-b">
                    <p className="text-xs text-muted-foreground mb-1">
                      Vehicle
                    </p>
                    <p className="font-semibold">
                      {bookingDetails.vehicle.make}{" "}
                      {bookingDetails.vehicle.model}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Year: {bookingDetails.vehicle.year}
                    </p>
                  </div>
                  <div className="pb-3 border-b">
                    <p className="text-xs text-muted-foreground mb-1">
                      License Plate
                    </p>
                    <p className="font-semibold font-mono">
                      {bookingDetails.vehicle.licensePlate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Location
                    </p>
                    <p className="font-semibold">
                      {bookingDetails.vehicle.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rental Details */}
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">Rental Period</h3>
                </div>
                <div className="space-y-4">
                  <div className="pb-3 border-b">
                    <p className="text-xs text-muted-foreground mb-1">
                      Pickup Date
                    </p>
                    <p className="font-semibold">
                      {formatDate(bookingDetails.dates.startDate)}
                    </p>
                  </div>
                  <div className="pb-3 border-b">
                    <p className="text-xs text-muted-foreground mb-1">
                      Return Date
                    </p>
                    <p className="font-semibold">
                      {formatDate(bookingDetails.dates.endDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Booked On
                    </p>
                    <p className="font-semibold">
                      {formatDate(bookingDetails.dates.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary - Full Width */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Payment Summary</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background/80 border rounded-lg p-5">
                  <p className="text-sm text-muted-foreground mb-2">
                    Total Cost
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(bookingDetails.pricing.totalPrice)}
                  </p>
                </div>
                <div className="bg-background/80 border rounded-lg p-5">
                  <p className="text-sm text-muted-foreground mb-2">
                    Amount Paid
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(bookingDetails.pricing.deposit)}
                  </p>
                </div>
                <div className="bg-background/80 border rounded-lg p-5">
                  <p className="text-sm text-muted-foreground mb-2">
                    Balance Due
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      bookingDetails.pricing.balance > 0
                        ? "text-destructive"
                        : "text-green-600"
                    }`}
                  >
                    {formatCurrency(bookingDetails.pricing.balance)}
                  </p>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 md:p-8">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">
                    Important Reminders
                  </h3>
                  <p className="text-sm text-blue-800">
                    Please review before your pickup date
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">
                      Required Documents
                    </p>
                    <p className="text-sm text-blue-800">
                      Bring valid driver license and payment method
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">
                      Arrival Time
                    </p>
                    <p className="text-sm text-blue-800">
                      Arrive 15 minutes before pickup time
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">
                      Modifications
                    </p>
                    <p className="text-sm text-blue-800">
                      Contact us to modify your booking
                    </p>
                  </div>
                </div>
                {bookingDetails.pricing.balance > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900 mb-1">
                        Payment Required
                      </p>
                      <p className="text-sm text-red-800">
                        Balance of{" "}
                        {formatCurrency(bookingDetails.pricing.balance)} due
                        before pickup
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!bookingDetails && (
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-card border rounded-lg p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center mx-auto mb-4">
                <Info className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Need Help?</h3>
              <p className="text-muted-foreground mb-6">
                Can&apos;t find your booking reference or having issues?
              </p>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Contact Support
                {/* <ArrowRight className="h-4 w-4" /> */}
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

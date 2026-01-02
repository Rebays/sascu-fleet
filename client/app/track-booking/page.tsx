"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { trackBooking, type TrackingResponse } from "@/lib/api";
import { BOOKING_STATUS_DISPLAY, PAYMENT_STATUS_DISPLAY } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

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

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Track Your Booking</h1>
      <Link href="/" className="underline mb-8 inline-block">
        Back to Home
      </Link>

      <div className="border p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Enter Your Booking Reference</h2>
        <p className="mb-6">
          Enter the booking reference number provided in your confirmation to view your booking
          status.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="trackingNumber" className="block mb-1 font-semibold">
              Booking Reference:
            </label>
            <input
              type="text"
              id="trackingNumber"
              name="trackingNumber"
              placeholder="BOOK-20260102-001"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full border p-2"
              required
            />
            <p className="text-sm text-gray-600 mt-1">
              Format: BOOK-YYYYMMDD-XXX (e.g., BOOK-20260102-001)
            </p>
          </div>

          <button
            type="submit"
            className="w-full border p-3 font-bold text-lg"
            disabled={loading}
          >
            {loading ? "Searching..." : "Track Booking"}
          </button>
        </form>

        {error && (
          <div className="mt-6 border border-red-500 bg-red-50 p-4">
            <h3 className="text-xl font-bold mb-2 text-red-700">Error</h3>
            <p className="text-red-600">{error}</p>
            <p className="mt-2 text-sm text-red-500">
              Make sure the backend server is running at http://localhost:5000
            </p>
          </div>
        )}

        {bookingDetails && (
          <div className="mt-8 border p-6">
            <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Booking Status</h3>
              <p className="mb-1">
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-block px-2 py-1 text-sm font-semibold ${
                    bookingDetails.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : bookingDetails.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : bookingDetails.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {BOOKING_STATUS_DISPLAY[bookingDetails.status] || bookingDetails.status}
                </span>
              </p>
              <p>
                <strong>Booking Reference:</strong> {bookingDetails.bookingRef}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Customer Information</h3>
              <p className="mb-1">
                <strong>Name:</strong> {bookingDetails.customer.name}
              </p>
              <p className="mb-1">
                <strong>Email:</strong> {bookingDetails.customer.email}
              </p>
              <p>
                <strong>Phone:</strong> {bookingDetails.customer.phone}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Vehicle Information</h3>
              <p className="mb-1">
                <strong>Vehicle:</strong> {bookingDetails.vehicle.make} {bookingDetails.vehicle.model} ({bookingDetails.vehicle.year})
              </p>
              <p className="mb-1">
                <strong>License Plate:</strong> {bookingDetails.vehicle.licensePlate}
              </p>
              <p>
                <strong>Location:</strong> {bookingDetails.vehicle.location}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Rental Details</h3>
              <p className="mb-1">
                <strong>Pickup Date:</strong> {formatDate(bookingDetails.dates.startDate)}
              </p>
              <p className="mb-1">
                <strong>Return Date:</strong> {formatDate(bookingDetails.dates.endDate)}
              </p>
              <p>
                <strong>Booked On:</strong> {formatDate(bookingDetails.dates.createdAt)}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Payment Information</h3>
              <p className="mb-1">
                <strong>Total Cost:</strong> {formatCurrency(bookingDetails.pricing.totalPrice)}
              </p>
              <p className="mb-1">
                <strong>Amount Paid:</strong> {formatCurrency(bookingDetails.pricing.deposit)}
              </p>
              <p className="mb-1">
                <strong>Balance Due:</strong> {formatCurrency(bookingDetails.pricing.balance)}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span
                  className={`inline-block px-2 py-1 text-sm font-semibold ${
                    bookingDetails.paymentStatus === "paid"
                      ? "bg-green-100 text-green-800"
                      : bookingDetails.paymentStatus === "partial"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {PAYMENT_STATUS_DISPLAY[bookingDetails.paymentStatus] ||
                    bookingDetails.paymentStatus}
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">Important Information</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Please bring a valid driver license and payment method</li>
                <li>Arrive 15 minutes before your pickup time</li>
                <li>Contact us if you need to modify your booking</li>
                {bookingDetails.pricing.balance > 0 && (
                  <li className="text-red-600 font-semibold">
                    Outstanding balance of {formatCurrency(bookingDetails.pricing.balance)} must
                    be paid before pickup
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="border p-6">
        <h3 className="text-xl font-bold mb-2">Need Help?</h3>
        <p className="mb-2">Can&apos;t find your booking reference or having issues?</p>
        <Link href="/about" className="underline">
          Contact Us
        </Link>
      </div>
    </div>
  );
}

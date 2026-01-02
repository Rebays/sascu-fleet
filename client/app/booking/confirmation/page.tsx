"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const trackingNumber = searchParams.get("trackingNumber");

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Booking Confirmation</h1>

      <div className="border p-6">
        <h2 className="text-2xl font-bold mb-4">Thank You for Your Booking!</h2>
        <p className="mb-6">Your vehicle rental has been successfully submitted.</p>

        {trackingNumber && (
          <div className="border p-4 mb-6">
            <h3 className="text-xl font-bold mb-2">Your Tracking Number:</h3>
            <p className="text-2xl font-mono mb-2"><strong>{trackingNumber}</strong></p>
            <p>Please save this tracking number. You can use it to track your booking status.</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">What Happens Next?</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>You will receive a confirmation email shortly with all booking details</li>
            <li>Our team will review your booking and verify the information</li>
            <li>You will receive a payment link to complete your reservation</li>
            <li>Once payment is confirmed, you will receive your rental agreement</li>
          </ol>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">Need Help?</h3>
          <p className="mb-2">If you have any questions about your booking, please contact us:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Email: bookings@sascufleet.com</li>
            <li>Phone: (555) 123-4567</li>
            <li>Hours: Monday-Friday, 8:00 AM - 6:00 PM</li>
          </ul>
        </div>

        <div className="pt-6 border-t space-x-4">
          <Link href="/" className="underline">Back to Home</Link>
          <span>|</span>
          <Link href="/track-booking" className="underline">Track Your Booking</Link>
          <span>|</span>
          <Link href="/vehicles" className="underline">Browse More Vehicles</Link>
        </div>
      </div>
    </div>
  );
}

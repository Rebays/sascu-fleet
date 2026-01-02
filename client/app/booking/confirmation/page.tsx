"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Info,
  HelpCircle,
  Mail,
  Phone,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const trackingNumber = searchParams.get("trackingNumber");

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-muted/60 via-muted/40 to-background border-b">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Booking Confirmation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your reservation has been submitted successfully
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-green-900 mb-2">
              Thank You for Your Booking!
            </h2>
            <p className="text-green-800">
              Your vehicle rental has been successfully submitted.
            </p>
          </div>
        </div>

        {/* Tracking Number */}
        {trackingNumber && (
          <div className="bg-card border rounded-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Your Tracking Number</h3>
            </div>
            <p className="text-2xl font-mono font-semibold mb-2">
              {trackingNumber}
            </p>
            <p className="text-muted-foreground text-sm">
              Please save this tracking number. You can use it to track your
              booking status.
            </p>
          </div>
        )}

        {/* What Happens Next */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold">What Happens Next?</h3>
          </div>
          <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
            <li>
              You will receive a confirmation email shortly with all booking
              details
            </li>
            <li>
              Our team will review your booking and verify the information
            </li>
            <li>
              You will receive a payment link to complete your reservation
            </li>
            <li>
              Once payment is confirmed, you will receive your rental agreement
            </li>
          </ol>
        </div>

        {/* Need Help */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold">Need Help?</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            If you have any questions about your booking, please contact us:
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email: bookings@sascufleet.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Phone: (555) 123-4567</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Hours: Monday-Friday, 8:00 AM - 6:00 PM</span>
            </li>
          </ul>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 border-t pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to Home
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/track-booking"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Track Your Booking
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse More Vehicles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

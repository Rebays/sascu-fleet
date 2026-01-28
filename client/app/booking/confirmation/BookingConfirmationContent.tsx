"use client";

import { useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";

export function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const trackingNumber = searchParams.get("trackingNumber");

  if (!trackingNumber) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-lg p-8 mb-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <FileText className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">Your Booking Reference</h3>
      </div>
      <div className="bg-background border border-primary/30 rounded-lg p-4 mb-4 inline-block">
        <p className="text-3xl md:text-4xl font-mono font-bold text-primary tracking-wider">
          {trackingNumber}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        Save this reference number to track your booking and manage your
        reservation
      </p>
    </div>
  );
}

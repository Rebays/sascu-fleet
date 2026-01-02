"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import {
  getVehicleById,
  createBooking,
  type GuestBookingData,
} from "@/lib/api";
import { formatCurrency, calculateDays } from "@/lib/utils";
import { VEHICLE_TYPE_DISPLAY } from "@/lib/constants";
import type { VehicleDisplay } from "@/lib/types";
import {
  Car,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  Loader2,
  ArrowRight,
  Info,
} from "lucide-react";

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const [vehicle, setVehicle] = useState<VehicleDisplay | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchVehicle() {
      if (!vehicleId) return;

      try {
        setLoading(true);
        const data = await getVehicleById(vehicleId);
        setVehicle(data);
      } catch (err: any) {
        setError("Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    }

    fetchVehicle();
  }, [vehicleId]);

  const days = startDate && endDate ? calculateDays(startDate, endDate) : 1;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    if (!vehicleId) {
      setError("No vehicle selected");
      setSubmitting(false);
      return;
    }

    const bookingData: GuestBookingData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      licenseNumber: formData.get("licenseNumber") as string,
      vehicleId: vehicleId,
      startDate: formData.get("pickupDate") as string,
      endDate: formData.get("returnDate") as string,
      pickupLocation: formData.get("pickupLocation") as string,
      additionalNotes: formData.get("additionalNotes") as string,
    };

    try {
      const response = await createBooking(bookingData);
      // Redirect to confirmation page with booking reference
      router.push(
        `/booking/confirmation?trackingNumber=${response.data.bookingRef}`
      );
    } catch (err: any) {
      setError(err.message || "Failed to create booking. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-muted/60 via-muted/40 to-background border-b">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Book Your Vehicle
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete your reservation in a few simple steps
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        {/* Back Link */}
        <Link
          href="/vehicles"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to Vehicles
        </Link>

        {loading && (
          <div className="bg-card border rounded-lg p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading vehicle details...</p>
          </div>
        )}

        {!loading && (!vehicleId || !vehicle) && (
          <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-destructive mb-2">
                  No Vehicle Selected
                </h3>
                <p className="text-destructive/90 mb-2">
                  Please select a vehicle from the vehicles page.
                </p>
                <Link
                  href="/vehicles"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Browse Vehicles
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {!loading && vehicle && (
          <>
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-900 mb-1">
                  <strong>Important:</strong> A valid driver's license and
                  payment method are required at pickup. All bookings require a
                  deposit.
                </p>
              </div>
            </div>

            {/* Booking Summary */}
            {startDate && endDate && (
              <div className="bg-card border rounded-lg p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Booking Summary</h2>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span>
                      {vehicle.displayName} (
                      {VEHICLE_TYPE_DISPLAY[vehicle.type] || vehicle.type})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Year: {vehicle.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location: {vehicle.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Pickup Date: {startDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Return Date: {endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <Clock className="h-4 w-4" /> */}
                    <span>
                      Duration: {days} day{days !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <span className="font-bold text-primary text-lg">
                      Total Cost: {formatCurrency(vehicle.pricePerDay * days)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 mb-8 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm text-destructive/90">{error}</div>
              </div>
            )}

            {/* Booking Form */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Booking Form</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="text-sm font-medium mb-2 block"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="text-sm font-medium mb-2 block"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="text-sm font-medium mb-2 block"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="text-sm font-medium mb-2 block"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="licenseNumber"
                        className="text-sm font-medium mb-2 block"
                      >
                        Driver License Number
                      </label>
                      <input
                        type="text"
                        id="licenseNumber"
                        name="licenseNumber"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Rental Details */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">Rental Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="pickupDate"
                        className="text-sm font-medium mb-2 block"
                      >
                        Pickup Date
                      </label>
                      <input
                        type="date"
                        id="pickupDate"
                        name="pickupDate"
                        defaultValue={startDate || ""}
                        min="2026-01-02"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="returnDate"
                        className="text-sm font-medium mb-2 block"
                      >
                        Return Date
                      </label>
                      <input
                        type="date"
                        id="returnDate"
                        name="returnDate"
                        defaultValue={endDate || ""}
                        min="2026-01-02"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="pickupLocation"
                        className="text-sm font-medium mb-2 block"
                      >
                        Pickup Location
                      </label>
                      <select
                        id="pickupLocation"
                        name="pickupLocation"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      >
                        <option value="">Select a location</option>
                        <option value="headoffice">Henderson</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="additionalNotes"
                        className="text-sm font-medium mb-2 block"
                      >
                        Additional Notes
                      </label>
                      <textarea
                        id="additionalNotes"
                        name="additionalNotes"
                        rows={4}
                        placeholder="Any special requests or requirements..."
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Booking...
                    </>
                  ) : (
                    <>
                      Submit Booking
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { getVehicleById, createGuestBooking, type GuestBookingData } from "@/lib/api";
import { formatCurrency, calculateDays } from "@/lib/utils";
import { VEHICLE_TYPE_DISPLAY } from "@/lib/constants";
import type { VehicleDisplay } from "@/lib/types";

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
      const response = await createGuestBooking(bookingData);
      // Redirect to confirmation page with booking reference
      router.push(`/booking/confirmation?trackingNumber=${response.data.bookingRef}`);
    } catch (err: any) {
      setError(err.message || "Failed to create booking. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Book Your Vehicle</h1>
        <p>Loading vehicle details...</p>
      </div>
    );
  }

  if (!vehicleId || !vehicle) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Book Your Vehicle</h1>
        <div className="border border-yellow-500 bg-yellow-50 p-4 mb-4">
          <p className="text-yellow-800">No vehicle selected.</p>
          <p className="text-sm text-yellow-700 mt-2">
            Please select a vehicle from the vehicles page.
          </p>
        </div>
        <Link href="/vehicles" className="underline">
          Browse Vehicles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Book Your Vehicle</h1>
      <Link href="/vehicles" className="underline mb-8 inline-block">
        Back to Vehicles
      </Link>

      {vehicle && startDate && endDate && (
        <div className="border p-4 mb-6">
          <h3 className="text-xl font-bold mb-3">Booking Summary</h3>
          <p className="mb-1">
            <strong>Vehicle:</strong> {vehicle.displayName} ({VEHICLE_TYPE_DISPLAY[vehicle.type]})
          </p>
          <p className="mb-1">
            <strong>Year:</strong> {vehicle.year}
          </p>
          <p className="mb-1">
            <strong>Location:</strong> {vehicle.location}
          </p>
          <p className="mb-1">
            <strong>Pickup Date:</strong> {startDate}
          </p>
          <p className="mb-1">
            <strong>Return Date:</strong> {endDate}
          </p>
          <p className="mb-1">
            <strong>Duration:</strong> {days} day{days !== 1 ? "s" : ""}
          </p>
          <p className="font-bold text-lg">
            <strong>Total Cost:</strong> {formatCurrency(vehicle.pricePerDay * days)}
          </p>
        </div>
      )}

      {error && (
        <div className="border border-red-500 bg-red-50 p-4 mb-6">
          <h3 className="text-xl font-bold mb-2 text-red-700">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="border p-6">
        <h2 className="text-2xl font-bold mb-4">Booking Form</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Personal Information</h3>

            <div className="mb-4">
              <label htmlFor="firstName" className="block mb-1 font-semibold">
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="w-full border p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="block mb-1 font-semibold">
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full border p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-semibold">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full border p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block mb-1 font-semibold">
                Phone Number:
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full border p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="licenseNumber" className="block mb-1 font-semibold">
                Driver License Number:
              </label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                className="w-full border p-2"
                required
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Rental Details</h3>

            <div className="mb-4">
              <label htmlFor="pickupDate" className="block mb-1 font-semibold">
                Pickup Date:
              </label>
              <input
                type="date"
                id="pickupDate"
                name="pickupDate"
                className="w-full border p-2"
                defaultValue={startDate || ""}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="returnDate" className="block mb-1 font-semibold">
                Return Date:
              </label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                className="w-full border p-2"
                defaultValue={endDate || ""}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="pickupLocation" className="block mb-1 font-semibold">
                Pickup Location:
              </label>
              <select
                id="pickupLocation"
                name="pickupLocation"
                className="w-full border p-2"
                required
              >
                <option value="">Select a location</option>
                <option value="main">Main Office - Downtown</option>
                <option value="airport">Airport Branch</option>
                <option value="north">North Side Location</option>
                <option value="south">South Side Location</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="additionalNotes" className="block mb-1 font-semibold">
                Additional Notes:
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                rows={4}
                className="w-full border p-2"
                placeholder="Any special requests or requirements..."
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="w-full border p-3 font-bold text-lg"
            disabled={submitting}
          >
            {submitting ? "Creating Booking..." : "Submit Booking"}
          </button>

          {submitting && (
            <p className="text-center text-sm text-gray-600 mt-2">
              Please wait while we process your booking...
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

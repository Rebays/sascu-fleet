"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState, useEffect, use } from "react";
import { getVehicleById, calculateBookingPrice } from "@/lib/api";
import { VEHICLE_TYPE_DISPLAY } from "@/lib/constants";
import { formatCurrency, calculateDays } from "@/lib/utils";
import type { VehicleDisplay } from "@/lib/types";

export default function VehicleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const [vehicle, setVehicle] = useState<VehicleDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const startDateFromUrl = searchParams.get("startDate");
  const endDateFromUrl = searchParams.get("endDate");

  useEffect(() => {
    async function fetchVehicle() {
      try {
        setLoading(true);
        setError(null);
        const data = await getVehicleById(id);
        setVehicle(data);
      } catch (err: any) {
        setError(err.message || "Failed to load vehicle");
        setVehicle(null);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicle();
  }, [id]);

  const handleCheckAvailability = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");

    setCheckingAvailability(true);

    // TODO: Replace with actual API call to check availability
    // For now, we just check if the vehicle is marked as available
    setTimeout(() => {
      setIsAvailable(vehicle?.isAvailable || false);
      setCheckingAvailability(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Loading...</h1>
        <Link href="/vehicles" className="underline">
          Back to Vehicles
        </Link>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Vehicle Not Found</h1>
        {error && (
          <div className="border border-red-500 bg-red-50 p-4 mb-4">
            <p className="text-red-600">{error}</p>
            <p className="mt-2 text-sm text-red-500">
              Make sure the backend server is running
            </p>
          </div>
        )}
        <Link href="/vehicles" className="underline">
          Back to Vehicles
        </Link>
      </div>
    );
  }

  const hasDates = startDateFromUrl && endDateFromUrl;
  const pricing = hasDates
    ? calculateBookingPrice(vehicle, startDateFromUrl, endDateFromUrl)
    : null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{vehicle.displayName}</h1>
      <Link href="/vehicles" className="underline mb-8 inline-block">
        Back to Vehicles
      </Link>

      <div className="border p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Vehicle Details</h2>
        <div className="space-y-2 mb-6">
          <p>
            <strong>Make:</strong> {vehicle.make}
          </p>
          <p>
            <strong>Model:</strong> {vehicle.model}
          </p>
          <p>
            <strong>Type:</strong>{" "}
            {VEHICLE_TYPE_DISPLAY[vehicle.type] || vehicle.type}
          </p>
          <p>
            <strong>Year:</strong> {vehicle.year}
          </p>
          <p>
            <strong>Location:</strong> {vehicle.location}
          </p>
          <p>
            <strong>License Plate:</strong> {vehicle.licensePlate}
          </p>
          <p>
            <strong>Price:</strong> {formatCurrency(vehicle.pricePerDay)}/day
            {vehicle.pricePerHour > 0 &&
              ` or ${formatCurrency(vehicle.pricePerHour)}/hour`}
          </p>
        </div>

        {vehicle.description && (
          <>
            <h3 className="text-xl font-bold mb-2">Description</h3>
            <p className="mb-6">{vehicle.description}</p>
          </>
        )}

        {vehicle.features && vehicle.features.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-2">Features</h3>
            <ul className="list-disc list-inside space-y-1">
              {vehicle.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* If dates are provided in URL (from search) */}
      {hasDates && pricing ? (
        <div className="border p-6">
          <h3 className="text-2xl font-bold mb-4">Booking Information</h3>
          <div className="space-y-2 mb-6">
            <p>
              <strong>Pickup Date:</strong> {startDateFromUrl}
            </p>
            <p>
              <strong>Return Date:</strong> {endDateFromUrl}
            </p>
            <p>
              <strong>Duration:</strong> {pricing.days} day
              {pricing.days !== 1 ? "s" : ""}
              {pricing.priceType === "hourly" && ` (${pricing.hours} hours)`}
            </p>
            <p className="text-xl">
              <strong>Total Cost:</strong> {formatCurrency(pricing.totalPrice)}
            </p>
          </div>

          {vehicle.isAvailable ? (
            <>
              <div className="border border-green-500 bg-green-50 p-4 mb-6">
                <p className="font-bold text-green-800">
                  ✓ This vehicle is available for your selected dates!
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Note: Booking functionality is not yet implemented (requires
                  authentication)
                </p>
              </div>
              <Link
                href={`/booking?vehicleId=${vehicle._id}&startDate=${startDateFromUrl}&endDate=${endDateFromUrl}`}
                className="w-full border p-3 font-bold text-lg inline-block text-center bg-gray-100 cursor-not-allowed opacity-50"
                onClick={(e) => e.preventDefault()}
              >
                Book Now (Coming Soon)
              </Link>
            </>
          ) : (
            <div className="border border-red-500 bg-red-50 p-4">
              <p className="font-bold text-red-800">
                ✗ This vehicle is currently unavailable
              </p>
              <p className="text-sm text-red-700 mt-1">
                Please try different dates or browse other vehicles.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* If no dates - show date picker to check availability */
        <div className="border p-6">
          <h3 className="text-2xl font-bold mb-4">Check Availability</h3>
          <p className="mb-4">
            Enter your rental dates to check if this vehicle is available and
            see pricing.
          </p>

          <form onSubmit={handleCheckAvailability}>
            <div className="space-y-4 mb-4">
              <div>
                <label htmlFor="startDate" className="block mb-1 font-semibold">
                  Pickup Date:
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="w-full border p-2"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block mb-1 font-semibold">
                  Return Date:
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="w-full border p-2"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full border p-3 font-bold text-lg"
              disabled={checkingAvailability}
            >
              {checkingAvailability ? "Checking..." : "Check Availability"}
            </button>
          </form>

          {isAvailable !== null && (
            <div
              className={`mt-6 border p-4 ${
                isAvailable
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }`}
            >
              {isAvailable ? (
                <div>
                  <p className="font-bold text-green-800 mb-2">
                    ✓ This vehicle is available!
                  </p>
                  <p className="text-sm text-green-700">
                    Please use the search tool on the homepage with your
                    specific dates to proceed with booking.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-red-800 mb-2">
                    ✗ This vehicle is not available for the selected dates.
                  </p>
                  <p className="text-sm text-red-700">
                    Please try different dates or browse other vehicles.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

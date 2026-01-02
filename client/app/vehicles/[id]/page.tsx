"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { getVehicleById, calculateBookingPrice, getBookedDates, checkDateConflict, type BookedDate } from "@/lib/api";
import { VEHICLE_TYPE_DISPLAY } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { VehicleDisplay } from "@/lib/types";

export default function VehicleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<VehicleDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  const [dateConflict, setDateConflict] = useState<BookedDate | null>(null);

  const startDateFromUrl = searchParams.get("startDate");
  const endDateFromUrl = searchParams.get("endDate");

  const [startDate, setStartDate] = useState(startDateFromUrl || "");
  const [endDate, setEndDate] = useState(endDateFromUrl || "");

  useEffect(() => {
    async function fetchVehicleData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch vehicle details and booked dates in parallel
        const [vehicleData, bookedDatesData] = await Promise.all([
          getVehicleById(id),
          getBookedDates(id)
        ]);

        setVehicle(vehicleData);
        setBookedDates(bookedDatesData.data.bookedDates);
      } catch (err: any) {
        setError(err.message || "Failed to load vehicle");
        setVehicle(null);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicleData();
  }, [id]);

  // Sync state with URL params
  useEffect(() => {
    if (startDateFromUrl) setStartDate(startDateFromUrl);
    if (endDateFromUrl) setEndDate(endDateFromUrl);
  }, [startDateFromUrl, endDateFromUrl]);

  // Validate dates whenever they change
  useEffect(() => {
    if (startDate && endDate && bookedDates.length > 0) {
      const conflict = checkDateConflict(startDate, endDate, bookedDates);
      setDateConflict(conflict);
    } else {
      setDateConflict(null);
    }
  }, [startDate, endDate, bookedDates]);

  const handleBookNow = () => {
    if (!startDate || !endDate) {
      alert("Please select both pickup and return dates");
      return;
    }

    if (dateConflict) {
      alert(`These dates conflict with an existing booking (${dateConflict.bookingRef}). Please select different dates.`);
      return;
    }

    router.push(`/booking?vehicleId=${vehicle?._id}&startDate=${startDate}&endDate=${endDate}`);
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

  const pricing = (startDate && endDate && vehicle)
    ? calculateBookingPrice(vehicle, startDate, endDate)
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

      {/* Booking Widget */}
      <div className="border p-6">
        <h3 className="text-2xl font-bold mb-4">Book This Vehicle</h3>

        {/* Show booked dates information */}
        {bookedDates.length > 0 && (
          <div className="border border-yellow-500 bg-yellow-50 p-4 mb-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Currently Booked Dates:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {bookedDates.map((booking, index) => (
                <li key={index}>
                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  {" "}({booking.status})
                </li>
              ))}
            </ul>
            <p className="text-xs text-yellow-600 mt-2">
              Please select dates that don't overlap with these bookings
            </p>
          </div>
        )}

        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4">Select Your Rental Dates</h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="startDate" className="block mb-1 font-semibold">
                Pickup Date: <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border p-2"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block mb-1 font-semibold">
                Return Date: <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border p-2"
                min={startDate || new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>
        </div>

        {pricing && (
          <div className="border p-4 mb-6 bg-gray-50">
            <h4 className="text-lg font-semibold mb-3">Rental Summary</h4>
            <div className="space-y-2">
              <p>
                <strong>Duration:</strong> {pricing.days} day
                {pricing.days !== 1 ? "s" : ""}
                {pricing.priceType === "hourly" && ` (${pricing.hours} hours)`}
              </p>
              <p>
                <strong>Rate:</strong> {formatCurrency(vehicle.pricePerDay)}/day
                {pricing.priceType === "hourly" && ` or ${formatCurrency(vehicle.pricePerHour)}/hour`}
              </p>
              <p className="text-xl pt-2 border-t">
                <strong>Total Cost:</strong> {formatCurrency(pricing.totalPrice)}
              </p>
            </div>
          </div>
        )}

        {/* Show validation status */}
        {dateConflict && startDate && endDate ? (
          <div className="border border-red-500 bg-red-50 p-4">
            <p className="font-bold text-red-800">
              ✗ Date Conflict Detected
            </p>
            <p className="text-sm text-red-700 mt-1">
              Your selected dates ({new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()})
              conflict with booking {dateConflict.bookingRef}.
            </p>
            <p className="text-sm text-red-700 mt-1">
              Conflicting booking: {new Date(dateConflict.startDate).toLocaleDateString()} - {new Date(dateConflict.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-red-600 mt-2 font-semibold">
              Please select different dates to continue.
            </p>
          </div>
        ) : startDate && endDate ? (
          <>
            <div className="border border-green-500 bg-green-50 p-4 mb-4">
              <p className="font-bold text-green-800">
                ✓ Vehicle is available for your selected dates!
              </p>
              <p className="text-sm text-green-700 mt-1">
                Click below to proceed with your booking.
              </p>
            </div>
            <button
              onClick={handleBookNow}
              className="w-full border p-3 font-bold text-lg hover:bg-gray-50"
            >
              Book Now
            </button>
          </>
        ) : (
          <div className="border p-4 bg-blue-50">
            <p className="text-blue-800">
              Please select both pickup and return dates to see pricing and check availability.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

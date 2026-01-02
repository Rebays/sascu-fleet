"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { searchVehicles } from "@/lib/api";
import { VEHICLE_TYPE_DISPLAY } from "@/lib/constants";
import { formatCurrency, calculateDays } from "@/lib/utils";
import type { VehicleDisplay } from "@/lib/types";

export default function VehicleSearchPage() {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<VehicleDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const type = searchParams.get("type");

  useEffect(() => {
    async function fetchVehicles() {
      try {
        setLoading(true);
        setError(null);
        const results = await searchVehicles({
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          type: type || undefined,
        });
        setVehicles(results);
      } catch (err: any) {
        setError(err.message || "Failed to search vehicles");
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, [startDate, endDate, type]);

  const days = startDate && endDate ? calculateDays(startDate, endDate) : 1;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Searching...</h1>
        <Link href="/" className="underline mb-8 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>
      <Link href="/" className="underline mb-8 inline-block">
        Back to Home
      </Link>

      {error && (
        <div className="border border-red-500 bg-red-50 p-4 mb-8">
          <h3 className="text-xl font-bold mb-2 text-red-700">Error Searching Vehicles</h3>
          <p className="text-red-600">{error}</p>
          <p className="mt-2 text-sm text-red-500">
            Make sure the backend server is running at http://localhost:5000
          </p>
        </div>
      )}

      <div className="border p-4 mb-8">
        <h2 className="text-xl font-bold mb-2">Search Criteria</h2>
        <p className="mb-1">
          <strong>Pickup Date:</strong> {startDate || "Not specified"}
        </p>
        <p className="mb-1">
          <strong>Return Date:</strong> {endDate || "Not specified"}
        </p>
        <p className="mb-1">
          <strong>Vehicle Type:</strong> {type ? VEHICLE_TYPE_DISPLAY[type] || type : "All Types"}
        </p>
        {startDate && endDate && (
          <p>
            <strong>Rental Duration:</strong> {days} day{days !== 1 ? "s" : ""}
          </p>
        )}
        {!startDate || !endDate ? (
          <p className="mt-2 text-sm text-gray-600">
            Note: Date-based availability checking requires backend support (coming soon)
          </p>
        ) : null}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">
          Available Vehicles ({vehicles.length})
        </h2>

        {vehicles.length === 0 && !error && (
          <div className="border p-6 text-center">
            <p className="text-lg mb-2">
              No vehicles found matching your search criteria.
            </p>
            <Link href="/" className="underline">
              Try a different search
            </Link>
          </div>
        )}

        {vehicles.length > 0 && (
          <ul className="space-y-4">
            {vehicles.map((vehicle) => (
              <li key={vehicle._id} className="border p-6">
                <h3 className="text-xl font-bold mb-2">{vehicle.displayName}</h3>
                <p className="mb-1">Type: {VEHICLE_TYPE_DISPLAY[vehicle.type] || vehicle.type}</p>
                <p className="mb-1">Year: {vehicle.year}</p>
                <p className="mb-1">Location: {vehicle.location}</p>
                <p className="mb-1">
                  Price: {formatCurrency(vehicle.pricePerDay)}/day
                  {vehicle.pricePerHour > 0 && ` or ${formatCurrency(vehicle.pricePerHour)}/hour`}
                </p>
                {startDate && endDate && (
                  <p className="mb-3 text-lg font-bold">
                    Total Cost: {formatCurrency(vehicle.pricePerDay * days)} ({days} day
                    {days !== 1 ? "s" : ""})
                  </p>
                )}
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 text-sm font-semibold ${
                    vehicle.isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.isAvailable ? 'Available' : 'Currently Unavailable'}
                  </span>
                </div>
                <Link
                  href={`/vehicles/${vehicle._id}${
                    startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : ''
                  }`}
                  className="underline font-semibold"
                >
                  View Details & Book
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

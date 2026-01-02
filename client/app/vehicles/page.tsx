import Link from "next/link";
import { getVehicles } from "@/lib/api";
import { VEHICLE_TYPE_DISPLAY } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { VehicleDisplay } from "@/lib/types";

export default async function VehiclesPage() {
  let vehicles: VehicleDisplay[] = [];
  let error: string | null = null;

  try {
    vehicles = await getVehicles();
  } catch (err: any) {
    error = err.message || "Failed to load vehicles";
    vehicles = [];
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Our Fleet</h1>
      <Link href="/" className="underline mb-8 inline-block">
        Back to Home
      </Link>

      <div className="border p-4 mb-8">
        <p className="mb-2">
          <strong>Note:</strong> To check availability and book a vehicle,
          please select a vehicle below and enter your rental dates.
        </p>
        <p>
          Or use the{" "}
          <Link href="/" className="underline">
            search tool
          </Link>{" "}
          on the homepage to find available vehicles for specific dates.
        </p>
      </div>

      {error && (
        <div className="border border-red-500 bg-red-50 p-4 mb-8">
          <h3 className="text-xl font-bold mb-2 text-red-700">
            Error Loading Vehicles
          </h3>
          <p className="text-red-600">{error}</p>
          <p className="mt-2 text-sm text-red-500">
            Make sure the backend server is running
          </p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-6">
          All Vehicles ({vehicles.length})
        </h2>

        {vehicles.length === 0 && !error && (
          <div className="border p-6 text-center">
            <p className="text-lg mb-2">No vehicles available at the moment.</p>
            <p className="text-sm text-gray-600">Please check back later.</p>
          </div>
        )}

        {vehicles.length > 0 && (
          <ul className="space-y-4">
            {vehicles.map((vehicle) => (
              <li key={vehicle._id} className="border p-6">
                <h3 className="text-xl font-bold mb-2">
                  {vehicle.displayName}
                </h3>
                <p className="mb-1">
                  Type: {VEHICLE_TYPE_DISPLAY[vehicle.type] || vehicle.type}
                </p>
                <p className="mb-1">Year: {vehicle.year}</p>
                <p className="mb-1">Location: {vehicle.location}</p>
                <p className="mb-3">
                  Price: {formatCurrency(vehicle.pricePerDay)}/day
                  {vehicle.pricePerHour > 0 &&
                    ` or ${formatCurrency(vehicle.pricePerHour)}/hour`}
                </p>
                <Link
                  href={`/vehicles/${vehicle._id}`}
                  className="underline font-semibold"
                >
                  View Details & Check Availability
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

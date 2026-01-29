"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { searchVehicles } from "@/lib/api";
import { VEHICLE_TYPE_DISPLAY, API_URL } from "@/lib/constants";
import { formatCurrency, calculateDays } from "@/lib/utils";
import type { VehicleDisplay } from "@/lib/types";
import {
  Car,
  Bike,
  Truck,
  MapPin,
  Calendar,
  ArrowRight,
  AlertCircle,
  Search,
  Loader2,
} from "lucide-react";

// Map vehicle types to icons
const VehicleIcon = ({ type }: { type: string }) => {
  const iconClass = "h-6 w-6";
  switch (type) {
    case "bike":
    case "scooter":
      return <Bike className={iconClass} />;
    case "truck":
      return <Truck className={iconClass} />;
    default:
      return <Car className={iconClass} />;
  }
};

// Helper function to get the full image URL
const getImageUrl = (imagePath: string): string => {
  // If it's already a full URL, return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  // Otherwise, construct URL using backend base URL
  const baseUrl = API_URL.replace("/api", "");
  return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export function VehicleSearchContent() {
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
      <div className="flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-lg">Searching for available vehicles...</p>
      </div>
    );
  }

  return (
    <>
      {/* Search Criteria Card */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Search Criteria</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Pickup Date</p>
            <p className="font-semibold">
              {startDate
                ? new Date(startDate).toLocaleDateString()
                : "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Return Date</p>
            <p className="font-semibold">
              {endDate
                ? new Date(endDate).toLocaleDateString()
                : "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Vehicle Type</p>
            <p className="font-semibold">
              {type ? VEHICLE_TYPE_DISPLAY[type] || type : "All Types"}
            </p>
          </div>
          {startDate && endDate && (
            <div>
              <p className="text-muted-foreground mb-1">Duration</p>
              <p className="font-semibold">
                {days} day{days !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Link
            href="/"
            className="text-sm text-primary hover:underline font-medium"
          >
            ← Modify Search
          </Link>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Error Searching Vehicles
              </h3>
              <p className="text-destructive/90 mb-2">{error}</p>
              <p className="text-sm text-destructive/70">
                Make sure the backend server is running
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Available Vehicles
          {vehicles.length > 0 && (
            <span className="text-muted-foreground ml-2">
              ({vehicles.length})
            </span>
          )}
        </h2>
      </div>

      {/* Empty State */}
      {vehicles.length === 0 && !error && (
        <div className="bg-card border rounded-lg p-12 text-center">
          <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
          <p className="text-muted-foreground mb-6">
            No vehicles match your search criteria. Try adjusting your dates or
            vehicle type.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try a Different Search
          </Link>
        </div>
      )}

      {/* Vehicle Grid */}
      {vehicles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="group bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Vehicle Image */}
              <div className="relative bg-muted/40 h-48 border-b overflow-hidden">
                {vehicle.images && vehicle.images.length > 0 ? (
                  <Image
                    src={getImageUrl(vehicle.images[0])}
                    alt={vehicle.displayName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <VehicleIcon type={vehicle.type} />
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-6">
                {/* Type Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                  <VehicleIcon type={vehicle.type} />
                  {VEHICLE_TYPE_DISPLAY[vehicle.type] || vehicle.type}
                </div>

                {/* Vehicle Name */}
                <h3 className="text-xl font-bold mb-3">
                  {vehicle.displayName}
                </h3>

                {/* Details */}
                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Year: {vehicle.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{vehicle.location}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4 pb-4 border-b">
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(vehicle.pricePerDay)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /day
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 h-5">
                    {vehicle.pricePerHour > 0 ? (
                      <>or {formatCurrency(vehicle.pricePerHour)}/hour</>
                    ) : (
                      <>&nbsp;</>
                    )}
                  </p>
                  {startDate && endDate && (
                    <p className="text-sm font-semibold text-foreground mt-2">
                      Total: {formatCurrency(vehicle.pricePerDay * days)} (
                      {days} day{days !== 1 ? "s" : ""})
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <Link
                  href={`/vehicles/${vehicle._id}${
                    startDate && endDate
                      ? `?startDate=${startDate}&endDate=${endDate}`
                      : ""
                  }`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 group-hover:gap-3"
                >
                  Reserve
                  <ArrowRight className="h-4 w-4 transition-all" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

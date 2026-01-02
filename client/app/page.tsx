"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import {
  Search,
  Calendar,
  Car,
  CheckCircle,
  Shield,
  Clock,
  Headphones,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");
    const vehicleType = formData.get("vehicleType");

    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate.toString());
    if (endDate) params.set("endDate", endDate.toString());
    if (vehicleType) params.set("type", vehicleType.toString());

    router.push(`/vehicles/search?${params.toString()}`);
  };

  return (
    <div className="-mt-[88px]">
      {/* Hero Section with Search Overlay */}
      <section className="relative h-[calc(66vh+88px)] min-h-[588px] flex items-center pt-24">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/315938/pexels-photo-315938.jpeg?_gl=1*1wihxp7*_ga*MTY4MjEyNDI4OS4xNzY3MzUwMjkw*_ga_8JE65Q40S6*czE3NjczNTAyOTAkbzEkZzEkdDE3NjczNTAzNzMkajU4JGwwJGgw')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>

        {/* Content Container */}
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Hero Text - Left Side */}
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                Book A Vehicle
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                INSERT SASCU DESCRIPTION HERE
              </p>
            </div>

            {/* Search Widget - Right Side */}
            <div className="w-full lg:w-[420px] lg:ml-auto">
              <div className="bg-card/95 backdrop-blur border rounded-lg shadow-2xl p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Search className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">
                    Find Your Ride
                  </h2>
                </div>

                <form onSubmit={handleSearch}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="startDate"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Pickup Date
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="endDate"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Return Date
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="vehicleType"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Car className="h-4 w-4" />
                        Vehicle Type
                      </label>
                      <select
                        id="vehicleType"
                        name="vehicleType"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">All Types</option>
                        <option value="car">Car</option>
                        <option value="truck">Truck</option>
                        <option value="bike">Bike</option>
                        <option value="scooter">Scooter</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Search className="h-4 w-4" />
                    Search Vehicles
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

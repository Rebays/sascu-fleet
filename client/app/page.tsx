"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  Star,
  Quote,
  ArrowRight,
  Zap,
  Award,
  Users,
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
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Welcome to SASCU Fleet</h1>
      <p className="text-lg mb-8">Your trusted partner for vehicle rentals</p>

      <div className="border p-6 mb-12">
        <h2 className="text-2xl font-bold mb-4">Search Available Vehicles</h2>
        <form onSubmit={handleSearch}>
          <div className="space-y-4">
            <div>
              <label htmlFor="startDate" className="block mb-1 font-semibold">
                Pickup Date:
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="w-full border p-2"
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
                required
              />
            </div>

            <div>
              <label htmlFor="vehicleType" className="block mb-1 font-semibold">
                Vehicle Type:
              </label>
              <select
                id="vehicleType"
                name="vehicleType"
                className="w-full border p-2"
              >
                <option value="">All Types</option>
                <option value="car">Car</option>
                <option value="truck">Truck</option>
                <option value="bike">Bike</option>
                <option value="scooter">Scooter</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full border p-3 font-bold text-lg"
            >
              Search Vehicles
            </button>
          </div>
        </form>
      </div>

      <nav className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Navigation</h2>
        <ul className="space-y-4">
          <li className="border p-4">
            <Link href="/vehicles" className="text-xl font-semibold underline">
              Browse Vehicles
            </Link>
            <p className="mt-1">
              View our complete fleet of available vehicles
            </p>
          </li>
          <li className="border p-4">
            <Link
              href="/track-booking"
              className="text-xl font-semibold underline"
            >
              Track Your Booking
            </Link>
            <p className="mt-1">Check the status of your reservation</p>
          </li>
          <li className="border p-4">
            <Link href="/about" className="text-xl font-semibold underline">
              About Us & Contact
            </Link>
            <p className="mt-1">Learn more about us and get in touch</p>
          </li>
        </ul>
      </nav>

      {/* <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose SASCU Fleet?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Wide selection of quality vehicles</li>
          <li>Competitive pricing</li>
          <li>Easy online booking</li>
          <li>24/7 customer support</li>
          <li>Multiple locations</li>
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Quick Start</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Browse our available vehicles</li>
          <li>Select your preferred vehicle</li>
          <li>Fill out the booking form</li>
          <li>Receive your confirmation and tracking number</li>
          <li>Pick up your vehicle on the scheduled date</li>
        </ol>
      </div> */}
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Car, Users, Fuel, Settings, ArrowRight, Star } from "lucide-react";
import { Vehicle } from "@/lib/vehicleData";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const {
    make,
    model,
    year,
    seats = 5,
    fuelType = "petrol",
    transmission = "automatic",
    pricePerDay,
    isAvailable,
    slug = "",
  } = vehicle;
  return (
    <Link href={`/vehicles/${slug}`}>
      <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
        {/* Image Container with Gradient Overlay */}
        <div className="relative w-full h-56 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Car className="w-32 h-32 text-slate-400 group-hover:scale-110 transition-transform duration-500" />
          </div>

          {/* Availability Badge */}
          <div className="absolute top-4 right-4">
            <Badge
              variant={isAvailable ? "default" : "destructive"}
              className={`${
                isAvailable
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500"
              } backdrop-blur-sm`}
            >
              {isAvailable ? "Available" : "Booked"}
            </Badge>
          </div>

          {/* Rating */}
          <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-semibold">4.8</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Title Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
              {make} {model}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              {year}
            </p>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl group-hover:bg-green-50 transition-colors">
              <Users className="w-5 h-5 text-gray-600 mb-1 group-hover:text-green-600 transition-colors" />
              <span className="text-xs text-gray-500">Seats</span>
              <span className="text-sm font-bold text-gray-900">{seats}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl group-hover:bg-green-50 transition-colors">
              <Fuel className="w-5 h-5 text-gray-600 mb-1 group-hover:text-green-600 transition-colors" />
              <span className="text-xs text-gray-500">Fuel</span>
              <span className="text-sm font-bold text-gray-900 capitalize">{fuelType.slice(0, 4)}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl group-hover:bg-green-50 transition-colors">
              <Settings className="w-5 h-5 text-gray-600 mb-1 group-hover:text-green-600 transition-colors" />
              <span className="text-xs text-gray-500">Trans</span>
              <span className="text-sm font-bold text-gray-900 capitalize">{transmission.slice(0, 4)}</span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-end justify-between pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Starting from</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ${pricePerDay}
                </span>
                <span className="text-sm text-gray-500 font-medium">/day</span>
              </div>
            </div>
            <Button
              className={`${
                isAvailable
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  : "bg-gray-400 cursor-not-allowed"
              } group-hover:gap-2 transition-all`}
              disabled={!isAvailable}
            >
              {isAvailable ? "Book" : "Unavailable"}
              {isAvailable && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </div>
        </div>

        {/* Hover Effect Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </Card>
    </Link>
  );
}

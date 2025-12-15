import VehicleCard from "@/components/VehicleCard";
import { getAllVehicles } from "@/lib/vehicleData";

export default function VehiclesPage() {
  const vehicles = getAllVehicles();

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Our Fleet</h1>
          <p className="text-gray-700 text-lg">
            Browse our complete collection of quality vehicles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => (
            <VehicleCard
              key={vehicle.slug || index}
              vehicle={vehicle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

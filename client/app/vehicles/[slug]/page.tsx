"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { getVehicleBySlug, calculateTotalPrice, createBooking } from "@/lib/vehicleData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Car, Users, Fuel, Settings, Check } from "lucide-react";

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const vehicle = getVehicleBySlug(slug);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    startDate: "",
    endDate: "",
  });

  const [totalPrice, setTotalPrice] = useState<number>(0);

  if (!vehicle) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Vehicle Not Found</h1>
          <p className="text-gray-700 mb-8">The vehicle you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/vehicles")}>Browse Vehicles</Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "startDate" || name === "endDate") {
      const start = name === "startDate" ? value : formData.startDate;
      const end = name === "endDate" ? value : formData.endDate;

      if (start && end) {
        const price = calculateTotalPrice(vehicle.pricePerDay, start, end);
        setTotalPrice(price);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicle.isAvailable) {
      alert("This vehicle is not available for booking.");
      return;
    }

    const booking = createBooking({
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalPrice,
    });

    router.push(`/booking/confirmation?id=${booking.id}`);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="relative w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-6 flex items-center justify-center">
              <Car className="w-48 h-48 text-gray-400" />
            </div>

            <h1 className="text-4xl font-bold mb-2 text-gray-900">{vehicle.name}</h1>
            <p className="text-xl text-gray-700 mb-4">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </p>

            <Badge variant={vehicle.isAvailable ? "default" : "destructive"} className="mb-6">
              {vehicle.isAvailable ? "Available" : "Unavailable"}
            </Badge>

            <p className="text-gray-700 mb-8">{vehicle.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                <Users className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Seats</p>
                  <p className="font-semibold">{vehicle.seats}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                <Fuel className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Fuel Type</p>
                  <p className="font-semibold capitalize">{vehicle.fuelType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg col-span-2">
                <Settings className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Transmission</p>
                  <p className="font-semibold capitalize">{vehicle.transmission}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Features</h3>
              <ul className="space-y-2">
                {vehicle.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-900">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <Card className="p-8 sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Price per day</p>
                <p className="text-4xl font-bold text-green-600">
                  ${vehicle.pricePerDay}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <Input
                    id="customerPhone"
                    name="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    required
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    min={formData.startDate || new Date().toISOString().split("T")[0]}
                  />
                </div>

                {totalPrice > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total Price</p>
                    <p className="text-3xl font-bold text-green-600">${totalPrice}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-lg py-6"
                  disabled={!vehicle.isAvailable}
                >
                  {vehicle.isAvailable ? "Complete Booking" : "Vehicle Unavailable"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

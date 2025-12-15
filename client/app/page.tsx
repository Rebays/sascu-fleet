import Hero from "@/components/Hero";
import VehicleCard from "@/components/VehicleCard";
import { getAllVehicles } from "@/lib/vehicleData";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
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
  const vehicles = getAllVehicles();
  const featuredVehicles = vehicles.slice(0, 3);

  return (
    <div>
      <Hero />

      {/* How It Works Section */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">
                Simple Process
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Rent a Car in <span className="text-green-600">3 Easy Steps</span>
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Our streamlined booking process gets you on the road in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-white group">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Choose Your Vehicle</h3>
              <p className="text-gray-700">
                Browse our fleet and select the perfect vehicle for your
                journey
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-white group">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Book Instantly</h3>
              <p className="text-gray-700">
                Fill in your details and confirm your booking with instant
                confirmation
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-white group">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Car className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Hit the Road</h3>
              <p className="text-gray-700">
                Pick up your vehicle and enjoy your adventure with full support
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-20 px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <Award className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">
                Our Fleet
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Featured Vehicles
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Discover our handpicked selection of top-rated vehicles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredVehicles.map((vehicle, index) => (
              <VehicleCard key={vehicle.slug || index} vehicle={vehicle} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/vehicles">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8"
              >
                View All Vehicles
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Why Choose <span className="text-green-600">SASCU Rentals</span>
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Experience the difference with our reliable service and unbeatable
              benefits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-100">
              <Shield className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-lg font-bold mb-2 text-gray-900">Fully Insured</h3>
              <p className="text-gray-700 text-sm">
                All vehicles come with comprehensive insurance coverage
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
              <Clock className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold mb-2 text-gray-900">24/7 Support</h3>
              <p className="text-gray-700 text-sm">
                Round-the-clock customer service for your peace of mind
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100">
              <CheckCircle className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-bold mb-2 text-gray-900">Instant Booking</h3>
              <p className="text-gray-700 text-sm">
                Get confirmation immediately after booking
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100">
              <Headphones className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-lg font-bold mb-2 text-gray-900">Expert Help</h3>
              <p className="text-gray-700 text-sm">
                Dedicated team ready to assist with any queries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Book your perfect vehicle today and experience the freedom of the
            open road
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vehicles">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-6 text-lg"
              >
                Browse Vehicles
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/manage-booking">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black px-10 py-6 text-lg"
              >
                Manage Booking
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { getBookingById } from "@/lib/vehicleData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, User, Mail, Phone, Car } from "lucide-react";
import Link from "next/link";

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("id");

  if (!bookingId) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Booking Not Found</h1>
          <p className="text-gray-700 mb-8">No booking ID provided.</p>
          <Button onClick={() => router.push("/vehicles")}>Browse Vehicles</Button>
        </div>
      </div>
    );
  }

  const booking = getBookingById(bookingId);

  if (!booking) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Booking Not Found</h1>
          <p className="text-gray-700 mb-8">The booking you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/vehicles")}>Browse Vehicles</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Booking Confirmed!</h1>
          <p className="text-xl text-gray-700">
            Your vehicle rental has been successfully booked.
          </p>
        </div>

        <Card className="p-8 mb-8">
          <div className="mb-6 pb-6 border-b">
            <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
            <p className="text-3xl font-bold text-green-600">{booking.id}</p>
            <p className="text-sm text-gray-500 mt-2">
              Save this reference number for managing your booking
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Car className="w-6 h-6 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Vehicle</p>
                <p className="text-lg font-semibold">{booking.vehicleName}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <User className="w-6 h-6 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Customer Name</p>
                <p className="text-lg font-semibold">{booking.customerName}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-semibold">{booking.customerEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-lg font-semibold">{booking.customerPhone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Calendar className="w-6 h-6 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Rental Period</p>
                <p className="text-lg font-semibold">
                  {new Date(booking.startDate).toLocaleDateString()} -{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg mt-6">
              <p className="text-sm text-gray-600 mb-1">Total Price</p>
              <p className="text-4xl font-bold text-green-600">${booking.totalPrice}</p>
            </div>
          </div>
        </Card>

        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8">
          <h3 className="font-bold text-lg mb-2 text-gray-900">What's Next?</h3>
          <ul className="space-y-2 text-sm text-gray-800">
            <li>• A confirmation email has been sent to {booking.customerEmail}</li>
            <li>• You can manage your booking using the reference number above</li>
            <li>• Please arrive 15 minutes before your scheduled pickup time</li>
            <li>• Don't forget to bring your driver's license and payment method</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/manage-booking" className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              Manage Booking
            </Button>
          </Link>
          <Link href="/vehicles" className="flex-1">
            <Button className="w-full bg-green-500 hover:bg-green-600" size="lg">
              Browse More Vehicles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

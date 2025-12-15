"use client";

import { useState } from "react";
import { getBookingById } from "@/lib/vehicleData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, Mail, Phone, Car } from "lucide-react";

export default function ManageBookingPage() {
  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const foundBooking = getBookingById(bookingId);
    setBooking(foundBooking);
    setSearched(true);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Manage Your Booking</h1>
          <p className="text-xl text-gray-700">
            Enter your booking reference to view and manage your reservation
          </p>
        </div>

        <Card className="p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="bookingId">Booking Reference</Label>
              <div className="flex gap-4">
                <Input
                  id="bookingId"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="BK-1234567890-ABCDEF"
                  className="flex-1"
                  required
                />
                <Button type="submit" className="bg-green-500 hover:bg-green-600">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Your booking reference was sent to your email after booking
              </p>
            </div>
          </form>
        </Card>

        {searched && !booking && (
          <Card className="p-8 text-center">
            <div className="text-gray-700">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No Booking Found</h3>
              <p>
                We couldn't find a booking with reference "{bookingId}". Please check
                your reference number and try again.
              </p>
            </div>
          </Card>
        )}

        {booking && (
          <Card className="p-8">
            <div className="mb-6 pb-6 border-b">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
                  <p className="text-3xl font-bold text-green-600">{booking.id}</p>
                </div>
                <Badge
                  variant={
                    booking.status === "confirmed"
                      ? "default"
                      : booking.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {booking.status.toUpperCase()}
                </Badge>
              </div>
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

              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Price</p>
                <p className="text-4xl font-bold text-green-600">${booking.totalPrice}</p>
              </div>

              <div className="pt-4">
                <p className="text-sm text-gray-500 mb-2">Booked on</p>
                <p className="text-sm font-medium">
                  {new Date(booking.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-900">Need to make changes?</h4>
              <p className="text-sm text-gray-800">
                Contact our support team at care@sascu.com or call us for any
                modifications to your booking.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

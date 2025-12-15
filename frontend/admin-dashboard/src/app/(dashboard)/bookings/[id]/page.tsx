'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Car, User, Mail, Phone, DollarSign, FileText, Clock, CheckCircle2, XCircle, Loader } from 'lucide-react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { use } from 'react';
import BookingActions from '@/components/BookingActions';

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = use(params);
  const { data: response, error, isLoading } = useSWR<any>(`/bookings/${id}`, fetcher);
  const {data: bookingPayments, error: paymentsError, isLoading: paymentsLoading} = useSWR<any>(`/bookings/admin/${id}/payments`, fetcher);
  const booking = response?.data;
  const payments = bookingPayments?.data || [];

  if (isLoading) return <div className="p-12 text-center"><Loader className="animate-spin flex w-6 h-6 mx-auto" />Loading booking details...</div>;
  if (error || !booking) return notFound();

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold">Booking #{booking.bookingRef}</h1>
          <p className="text-gray-600 mt-2">Created on {formatDate(booking.createdAt)}</p>
        </div>
        <div className="flex gap-3">
          <Badge variant={booking.paymentStatus === 'paid' ? 'default' : booking.paymentStatus === 'partial' ? 'secondary' : 'destructive'} className="text-lg px-4 py-2">
            {booking.paymentStatus.toUpperCase()}
          </Badge>
          <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'} className="text-lg px-4 py-2">
            {booking.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Customer & Vehicle */}
        <div className="space-y-6">
          {/* Customer Card */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="w-6 h-6" />
              Customer
            </h2>
            <div className="space-y-3">
              <p className="font-semibold text-lg">{booking.user?.name || 'N/A'}</p>
              <p className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" /> {booking.user?.email}
              </p>
              {booking.user?.phone && (
                <p className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" /> {booking.user.phone}
                </p>
              )}
            </div>
          </Card>

          {/* Vehicle Card */}
          
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Car className="w-6 h-6" />
              Vehicle
            </h2>
            {booking.vehicle?.images?.[0] ? (
              <Image
                src={booking.vehicle.images[0]}
                alt={booking.vehicle.model}
                width={400}
                height={200}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-lg w-full h-48 mb-4" />
            )}
            <p className="font-semibold text-lg">{booking.vehicle?.make} {booking.vehicle?.model}</p>
            <p className="text-gray-600">License: {booking.vehicle?.licensePlate}</p>
            <p className="text-gray-600 mt-2">
              Rate: SBD{booking.vehicle?.pricePerHour}/hr • SBD{booking.vehicle?.pricePerDay}/day
            </p>
          </Card>
        </div>

        {/* Right Column - Invoice & Payments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Summary */}
          <Card className="p-8 bg-linear-to-br from-blue-50 to-indigo-50 border-blue-200">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-700" />
              Invoice Summary
            </h2>

            <div className="space-y-4 text-lg">
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span className="font-bold">SBD{booking.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span>Deposit Paid</span>
                <span className="font-bold">- SBD{(booking.deposit || 0).toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-2xl font-bold text-indigo-700">
                <span>Balance Due</span>
                <span>SBD{(booking.totalPrice - (booking.deposit || 0)).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-blue-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Booking Period:</span>
                <strong>{formatDate(booking.startDate)}</strong>
                <span>→</span>
                <strong>{formatDate(booking.endDate)}</strong>
              </div>
            </div>
          </Card>

          {/* Payment History */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Payment History</h2>
            
            {payments && payments.length > 0 ? (
              <div className="space-y-3">
                {payments.map((p: any, i: number) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      {p.status === 'succeeded' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium">SBD{p.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          {p.method || 'Manual'} • {new Date(p.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={p.status === 'succeeded' ? 'default' : 'destructive'}>
                      {p.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No payments recorded yet</p>
            )}
          </Card>

          {/* Action Buttons */}
          <BookingActions booking={booking} onPaymentRecorded={() => mutate(`/bookings/${id}`)} />
        </div>
      </div>
    </div>
  );
}
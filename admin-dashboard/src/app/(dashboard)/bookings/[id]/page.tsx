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
import { use, useState, useEffect } from 'react';
import BookingActions from '@/components/BookingActions';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';

  


export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: response, error, isLoading } = useSWR<any>(`/bookings/${id}`, fetcher);
  const { data: bookingPayments, error: paymentsError, isLoading: paymentsLoading } = useSWR<any>(`/bookings/admin/${id}/payments`, fetcher);
  const booking = response?.data;

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<'confirmed' | 'cancelled' | null>(null);
  const [statusNote, setStatusNote] = useState('');

  const payments = bookingPayments?.data || [];

  const openStatusModal = (status: 'confirmed' | 'cancelled') => {
    setPendingStatus(status);
    setStatusNote('');
    setStatusModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!pendingStatus) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/admin/${booking._id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            status: pendingStatus,
            note: statusNote || undefined,
          }),
        }
      );

      if (!res.ok) throw new Error();
      toast.success(`Booking ${pendingStatus === 'confirmed' ? 'approved' : 'rejected'}!`);
      // revalidate booking detail and payments, and refresh bookings list
      mutate(`/bookings/${booking._id}`);
      mutate(`/bookings/admin/${booking._id}/payments`);
      mutate('/bookings/admin/all');
      setStatusModalOpen(false);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const router = useRouter();

  useEffect(() => {
    if (error) {
      const status = (error as any)?.response?.status;
      if (status === 404) {
        toast.error('Booking not found — it may have been deleted.');
        router.push('/bookings');
      } else {
        toast.error('Failed to load booking');
      }
    } else if (!booking && !isLoading) {
      // No booking returned (unexpected) — redirect back
      toast.error('Booking not found');
      router.push('/bookings');
    }
  }, [error, booking, isLoading, router]);

  if (isLoading) return <div className="p-12 text-center"><Loader className="animate-spin flex w-6 h-6 mx-auto" />Loading booking details...</div>;

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
        <div className="flex gap-3 print:hidden">
          <Badge variant={booking.paymentStatus === 'paid' ? 'default' : booking.paymentStatus === 'partial' ? 'secondary' : 'destructive'} className="text-lg px-4 py-2">
            {booking.paymentStatus.toUpperCase()}
          </Badge>
          <Badge variant={booking.status === 'confirmed' ? 'success' : 'outline'} className="text-lg px-4 py-2">
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

          <Card className="p-6 print:hidden">
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

          {/* Approve/Reject Buttons — Only show if pending */}
        {booking.status === 'pending' && (
          <div className="flex gap-3">
            <Button
              size="sm"
              onClick={() => openStatusModal('confirmed')}
              className="bg-green-500 hover:bg-green-600 rounded-full flex items-center"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Approve Booking
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => openStatusModal('cancelled')}
              className="rounded-full flex items-center"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Reject Booking
            </Button>
          </div>
        )}

          {/* Invoice Summary */}
          <Card className="p-8 bg-linear-to-br from-blue-50 to-indigo-50 border-blue-200">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 dark:text-slate-800">
              <FileText className="w-8 h-8 text-blue-700 dark:text-slate-800" />
              Invoice Summary
            </h2>

            <div className="space-y-4 text-lg">
              <div className="flex justify-between">
                <span className="dark:text-slate-800">Total Amount</span>
                <span className="font-bold dark:text-slate-800">SBD{booking.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-700 dark:text-green-600">
                <span>Deposit Paid</span>
                <span className="font-bold">- SBD{(booking.deposit || 0).toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-2xl font-bold text-indigo-700 dark:text-indigo-600">
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

          {/* Status History */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Status History
            </h2>

            {booking.statusHistory && booking.statusHistory.length > 0 ? (
              <div className="space-y-3">
                {booking.statusHistory.slice().reverse().map((h: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <Badge variant={h.status === 'confirmed' ? 'default' : h.status === 'cancelled' ? 'destructive' : 'secondary'}>
                        {h.status}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        by <strong>{h.changedBy?.name || 'Admin'}</strong>
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(h.changedAt)}
                      {h.note && <p className="text-xs italic mt-1">{h.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No status changes yet</p>
            )}
          </Card>

          {/* Action Buttons */}
          <BookingActions
            booking={booking}
            onPaymentRecorded={() => {
              // ensure the booking detail and its payments are revalidated
              mutate(`/bookings/${id}`);
              mutate(`/bookings/admin/${id}/payments`);
              mutate('/bookings/admin/all');
            }}
          />
        </div>
      </div>

      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingStatus === 'confirmed' ? 'Approve' : 'Reject'} Booking
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to {pendingStatus === 'confirmed' ? 'approve' : 'reject'} this booking?</p>
            <div>
              <Label>Optional Note</Label>
              <Input
                placeholder="e.g. Customer confirmed via phone"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusModalOpen(false)}>Cancel</Button>
            <Button
              variant={pendingStatus === 'cancelled' ? 'destructive' : 'default'}
              onClick={handleStatusChange}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
}
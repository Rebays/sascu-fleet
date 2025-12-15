'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Mail, Printer, CreditCard, Banknote, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSWRConfig } from 'swr';

interface BookingActionsProps {
  booking: any;
  onPaymentRecorded?: () => void;
}

export default function BookingActions({ booking, onPaymentRecorded }: BookingActionsProps) {
    const { mutate } = useSWRConfig();

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('card');

  const handleRecordPayment = async () => {
    
    if (!amount || Number(amount) <= 0) {
    toast.error('Enter valid amount');
    return;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bookings/admin/${booking._id}/payments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          paymentMethod: method,
          notes: 'Recorded via admin panel'
        }),
      }
    );

    if (!res.ok) throw new Error();

    toast.success(`SBD${amount} recorded as ${method}!`);
    mutate(`/bookings/admin/${booking._id}`); // refresh detail page
    mutate('/bookings/admin/all');           // refresh list if open
    setPaymentOpen(false);
    setAmount('');
  } catch (err) {
    toast.error('Failed to record payment');
  }

    
  };

  const handleSendInvoice = async () => {
    setSendingEmail(true);
    try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bookings/admin/${booking._id}/send-invoice`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );

        if (!res.ok) throw new Error();
        console.log(`Invoice sent to ${booking.user.email}!`);
        setInvoiceOpen(false);
    } catch (err) {
        console.error('Failed to send invoice');
    }
    finally{
        setSendingEmail(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex gap-4 mt-8 print:hidden">
        <Button onClick={() => setPaymentOpen(true)} className="flex-1">
          <DollarSign className="w-5 h-5 mr-2" />
          Record Payment
        </Button>
        <Button variant="outline" onClick={() => setInvoiceOpen(true)} className="flex-1">
          <Mail className="w-5 h-5 mr-2" />
          Send Invoice
        </Button>
        <Button variant="outline" onClick={handlePrintInvoice}>
          <Printer className="w-5 h-5 mr-2" />
          Print Invoice
        </Button>
      </div>

      {/* Record Payment Modal */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <Label>Booking</Label>
              <p className="font-medium">#{booking.bookingRef}</p>
            </div>
            <div>
              <Label>Customer</Label>
              <p className="font-medium">{booking.user?.name}</p>
            </div>
            <div>
              <Label>Amount Due</Label>
              <p className="text-2xl font-bold text-red-600">
                SBD{(booking.totalPrice - (booking.deposit || 0)).toLocaleString()}
              </p>
            </div>
            <div>
              <Label>Payment Amount (SBD)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
              />
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Card
                    </div>
                  </SelectItem>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4" /> Cash
                    </div>
                  </SelectItem>
                  <SelectItem value="eft">EFT / Bank Transfer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentOpen(false)}>Cancel</Button>
            <Button onClick={handleRecordPayment}>
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Invoice Modal */}
      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Invoice</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <Mail className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Send invoice to customer?</h3>
            <p className="text-gray-600">
              Invoice will be emailed to:
              <br />
              <strong>{booking.user?.email}</strong>
            </p>
            <p  className="text-sm text-gray-500 mt-4">
              Total: SBD{booking.totalPrice} • Deposit Paid: SBD{booking.deposit || 0} • Balance: SBD{booking.totalPrice - (booking.deposit || 0)}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoiceOpen(false)}>Cancel</Button>
            <Button  className="ml-2" onClick={handleSendInvoice} disabled={sendingEmail}>
              {sendingEmail ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin flex" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2 " />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
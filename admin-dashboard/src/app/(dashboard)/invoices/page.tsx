'use client';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function Invoices() {
  const { data: response, error, isLoading, mutate } = useSWR<any>('/admin/invoices', fetcher);
  const invoices = response?.data || [];

  const downloadPDF = async (id: string, number: string) => {
    const res = await api.get(`/admin/invoices/${id}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${number}.pdf`);
    document.body.appendChild(link);
    link.click();
  };

  const emailInvoice = async (id: string) => {
    await api.post(`/admin/invoices/${id}/email`);
    toast.success('Invoice emailed!');
  };



  return (
    <div>
      <h1 className="text-xl font-semibold text-blue-900">Invoices ({invoices.length})</h1>
      <div className="grid gap-4">
        {invoices?.map((inv: any) => (
          <Card key={inv._id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-bold">{inv.invoiceNumber}</p>
              <p>Booking: {inv.bookingRef} • Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
              <p>Amount: ${inv.totalAmount} • Paid: ${inv.paidAmount} • Status: <span className="font-semibold">{inv.status}</span></p>
            </div>
            <div className="space-x-2">
              <Button onClick={() => downloadPDF(inv._id, inv.invoiceNumber)}>PDF</Button>
              <Button variant="outline" onClick={() => emailInvoice(inv._id)}>Email</Button>
            </div>
          </Card>
        )) 
          && 
          
          <p>Invoice tray is empty.</p>
        
        }
      </div>
    </div>
  );
}
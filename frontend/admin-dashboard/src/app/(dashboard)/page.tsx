"use client";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import { DollarSign, Car, Calendar, FileText } from 'lucide-react';
import useSWR from 'swr';
import api from '@/lib/api';


const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function Dashboard() {
  const router = useRouter();
  const { data: stats } = useSWR('/reports/dashboard', fetcher);

  const cards = [
    { title: 'Total Revenue', value: `$${stats?.summary.totalRevenue || 0}`, icon: DollarSign },
    { title: 'Active Bookings', value: stats?.summary.confirmedBookings || 0, icon: Calendar },
    { title: 'Available Vehicles', value: stats?.summary.availableVehicles || 0, icon: Car },
    { title: 'Pending Invoices', value: stats?.summary.pendingPayments || 0, icon: FileText },
  ];

  const user = JSON.parse(localStorage.getItem('user') || '{}');
 
  if(user.role !== 'admin') {
        router.push('/login');
  }

  return (
    
    <div>

      <h1 className="text-2xl font-bold mb-6 text-blue-900">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-blue-600">{card.value}</p>
              </div>
              <card.icon className="w-10 h-10 text-blue-600" />
            </div>
          </Card>
        ))}
      </div>
      {/* Add revenue chart here later */}
    </div>
  );
}
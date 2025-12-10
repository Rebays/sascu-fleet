// src/app/(dashboard)/reports/page.tsx  or  /dashboard/page.tsx
'use client';
import { Card } from '@/components/ui/card';
import { DollarSign, Car, Calendar, TrendingUp } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';

export default function DashboardPage() {
  const { data: response, error, isLoading } = useSWR<any>('/reports/dashboard', fetcher);
  
  // Extract the real data
  const stats = response?.data;

  if (isLoading) return <div className="text-center py-20">Loading dashboard...</div>;
  if (error || !stats) return <div className="text-center py-20 text-red-600">Failed to load</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">R{stats.totalRevenue?.toLocaleString() || 0}</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold mt-2">{stats.totalBookings || 0}</p>
            </div>
            <Calendar className="w-12 h-12 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Vehicles</p>
              <p className="text-3xl font-bold mt-2">{stats.totalVehicles || 0}</p>
            </div>
            <Car className="w-12 h-12 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-3xl font-bold mt-2">R{stats.todayRevenue || 0}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-amber-600" />
          </div>
        </Card>
      </div>
    </div>
  );
}
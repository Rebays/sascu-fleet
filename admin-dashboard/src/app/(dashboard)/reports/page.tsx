'use client';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { DollarSign, Car, Calendar, TrendingUp } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';

export default function DashboardPage() {
  const { data: response, error, isLoading } = useSWR<any>('/reports/dashboard', fetcher);
  // try multiple shapes for compatibility with controller responses
  const stats = response?.summary || response?.data || response;

  const todayStr = (d = new Date()) => d.toISOString().slice(0, 10);
  const thirtyDaysAgo = (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0, 10); })();
  const oneYearAgo = (() => { const d = new Date(); d.setMonth(d.getMonth() - 11); d.setDate(1); return d.toISOString().slice(0, 10); })();

  const [dailyStart, setDailyStart] = useState(thirtyDaysAgo);
  const [dailyEnd, setDailyEnd] = useState(todayStr());
  const [monthlyStart, setMonthlyStart] = useState(oneYearAgo);
  const [monthlyEnd, setMonthlyEnd] = useState(todayStr());
  const [typeStart, setTypeStart] = useState(thirtyDaysAgo);
  const [typeEnd, setTypeEnd] = useState(todayStr());

  const dailyKey = `/reports/revenue?groupBy=day&startDate=${dailyStart}&endDate=${dailyEnd}`;
  const monthlyKey = `/reports/revenue?groupBy=month&startDate=${monthlyStart}&endDate=${monthlyEnd}`;
  const typeKey = `/reports/revenue-by-type?startDate=${typeStart}&endDate=${typeEnd}`;

  const { data: dailyResp } = useSWR<any>(dailyKey, fetcher);
  const { data: monthlyResp } = useSWR<any>(monthlyKey, fetcher);
  const { data: typeResp } = useSWR<any>(typeKey, fetcher);

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:5000') + '/api';

  const downloadCsv = (url: string) => {
    window.location.href = url;
  };

  if (isLoading) return <div className="text-center py-20">Loading dashboard...</div>;
  if (error || !stats) return <div className="text-center py-20 text-red-600">Failed to load</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">R{(stats.totalRevenue || 0).toLocaleString()}</p>
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
              <p className="text-3xl font-bold mt-2">{stats.availableVehicles ?? stats.totalVehicles ?? 0}</p>
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

      <h2 className="text-2xl font-semibold mb-4">Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold">Booking Daily vs Revenue</h3>
          <div className="mt-2 space-y-2">
            <div className="flex gap-2">
              <input type="date" value={dailyStart} onChange={(e) => setDailyStart(e.target.value)} className="border p-2 rounded" />
              <input type="date" value={dailyEnd} onChange={(e) => setDailyEnd(e.target.value)} className="border p-2 rounded" />
              <button className="px-3 py-2 bg-sky-600 text-white rounded" onClick={() => downloadCsv(`${API_BASE}/reports/revenue?groupBy=day&startDate=${dailyStart}&endDate=${dailyEnd}&format=csv`)}>Download CSV</button>
            </div>
            <div className="overflow-auto mt-3">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr><th className="text-left">Period</th><th className="text-right">Revenue</th><th className="text-right">Transactions</th></tr>
                </thead>
                <tbody>
                  {dailyResp?.revenue?.length ? dailyResp.revenue.map((r: any) => (
                    <tr key={r._id}><td>{r._id}</td><td className="text-right">R{r.revenue}</td><td className="text-right">{r.count}</td></tr>
                  )) : <tr><td colSpan={3} className="text-center py-4">No data</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold">Booking Monthly vs Revenue</h3>
          <div className="mt-2 space-y-2">
            <div className="flex gap-2 items-center">
              <input type="month" value={monthlyStart.slice(0,7)} onChange={(e) => setMonthlyStart(e.target.value + '-01')} className="border p-2 rounded" />
              <input type="month" value={monthlyEnd.slice(0,7)} onChange={(e) => setMonthlyEnd(e.target.value + '-01')} className="border p-2 rounded" />
              <button className="px-3 py-2 bg-sky-600 text-white rounded" onClick={() => downloadCsv(`${API_BASE}/reports/revenue?groupBy=month&startDate=${monthlyStart}&endDate=${monthlyEnd}&format=csv`)}>Download CSV</button>
            </div>
            <div className="overflow-auto mt-3">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr><th className="text-left">Month</th><th className="text-right">Revenue</th><th className="text-right">Transactions</th></tr>
                </thead>
                <tbody>
                  {monthlyResp?.revenue?.length ? monthlyResp.revenue.map((r: any) => (
                    <tr key={r._id}><td>{r._id}</td><td className="text-right">R{r.revenue}</td><td className="text-right">{r.count}</td></tr>
                  )) : <tr><td colSpan={3} className="text-center py-4">No data</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold">Booking Revenue by Vehicle Type</h3>
          <div className="mt-2 space-y-2">
            <div className="flex gap-2">
              <input type="date" value={typeStart} onChange={(e) => setTypeStart(e.target.value)} className="border p-2 rounded" />
              <input type="date" value={typeEnd} onChange={(e) => setTypeEnd(e.target.value)} className="border p-2 rounded" />
              <button className="px-3 py-2 bg-sky-600 text-white rounded" onClick={() => downloadCsv(`${API_BASE}/reports/revenue-by-type?startDate=${typeStart}&endDate=${typeEnd}&format=csv`)}>Download CSV</button>
            </div>
            <div className="overflow-auto mt-3">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr><th className="text-left">Type</th><th className="text-right">Revenue</th><th className="text-right">Bookings</th></tr>
                </thead>
                <tbody>
                  {typeResp?.revenue?.length ? typeResp.revenue.map((r: any) => (
                    <tr key={r._id}><td>{r._id}</td><td className="text-right">R{r.revenue}</td><td className="text-right">{r.bookings}</td></tr>
                  )) : <tr><td colSpan={3} className="text-center py-4">No data</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
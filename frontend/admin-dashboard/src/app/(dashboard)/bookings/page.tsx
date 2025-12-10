// src/app/(dashboard)/bookings/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';

import {
  Calendar,
  Car,
  User,
  Edit,
  Trash2,
  Plus,
  Check,
  ChevronsUpDown,
  List,
  Grid3x3,
  Search,
  Download,
} from 'lucide-react';

import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminBookingsPage() {
  const { data: bookingsRes, error: bError, isLoading: bLoading } = useSWR<any>('/bookings/admin/all', fetcher);
  const { data: vehiclesRes, error: vError, isLoading: vLoading } = useSWR<any>('/vehicles', fetcher);
  const { data: usersRes, error: uError, isLoading: uLoading } = useSWR<any>('/users/all', fetcher);

  
  const bookings = bookingsRes?.data?.data || [];
  const vehicles = vehiclesRes || [];
  const users = usersRes?.data || [];

  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    userId: '',
    vehicleId: '',
    startDate: '',
    endDate: '',
    status: 'pending',
    paymentStatus: 'pending',
    totalPrice:'0.00'
  });

  // Picker states
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const [search, setSearch] = useState('');

  //search functionality
  const filtered = useMemo(() => {
    if (!search) return bookings;
    const lower = search.toLowerCase();
    return bookings.filter((b: any) =>
      b.bookingRef.toLowerCase().includes(lower) ||
      b.user?.name?.toLowerCase().includes(lower) ||
      b.user?.email?.toLowerCase().includes(lower) ||
      b.vehicle?.make?.toLowerCase().includes(lower) ||
      b.vehicle?.model?.toLowerCase().includes(lower)
    );
  }, [bookings, search]);
  
  const openCreateModal = () => {
    setEditing(null);
    setForm({
      userId: '',
      vehicleId: '',
      startDate: '',
      endDate: '',
      status: 'pending',
      paymentStatus: 'pending',
      totalPrice:'0.00'
    });
    setCreatingUser(false);
    setOpen(true);
  };

  const openEditModal = (booking: any) => {
    setEditing(booking);
    setForm({
      userId: booking.user?._id || '',
      vehicleId: booking.vehicle?._id || '',
      startDate: booking.startDate.slice(0, 16),
      endDate: booking.endDate.slice(0, 16),
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      totalPrice: booking.totalPrice.toString(),
    });
    setCreatingUser(false);
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.userId || !form.vehicleId || !form.startDate || !form.endDate) {
      toast.error('Please fill all required fields');
      return;
    }

    //calculate total price based on vehicle daily rate and number of days
   
    const vehicle = vehicles.find((v: any) => v._id === form.vehicleId);
    if (!vehicle) {
      toast.error('Vehicle not found');
      return;
    }

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const totalPrice = days * vehicle.pricePerDay;

    const payload = {
      user: form.userId,
      vehicle: form.vehicleId,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      status: form.status,
      paymentStatus: form.paymentStatus,
      totalPrice: totalPrice,
    };

    try {
      const url = editing
        ? `${process.env.NEXT_PUBLIC_API_URL}/bookings/admin/${editing._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/bookings/admin`;

      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      toast.success(editing ? 'Booking updated!' : 'Booking created!');
      mutate('/bookings/admin/all');
      setOpen(false);
    } catch (err) {
      toast.error('Failed to save booking');
    }
  };

  const handleCreateUser = async () => {
    if (!newUserName || !newUserEmail) {
      toast.error('Name and email required');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: 'temp123456',
          phone: '',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`User ${newUserName} created!`);
        setForm({ ...form, userId: data.user.id });
        mutate('/users');
        setCreatingUser(false);
        setNewUserName('');
        setNewUserEmail('');
      } else {
        toast.error(data.message || 'Failed to create user');
      }
    } catch {
      toast.error('Network error');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Booking Ref',
      'Customer Name',
      'Email',
      'Vehicle',
      'Start Date',
      'End Date',
      'Total Price',
      'Status',
      'Payment Status',
    ];

    const rows = filtered.map((b: any) => [
      b.bookingRef,
      b.user?.name || 'N/A',
      b.user?.email || 'N/A',
      `${b.vehicle?.make || ''} ${b.vehicle?.model || ''}`.trim(),
      formatDate(b.startDate),
      formatDate(b.endDate),
      b.totalPrice,
      b.status,
      b.paymentStatus,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings-export-${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (bLoading) return <div className="text-center py-20">Loading bookings...</div>;
  if(vLoading || uLoading) return <div className="text-center py-20">Loading support data...</div>
  if (bError || vError || uError) return <div className="text-center py-20 text-red-600">Failed to load bookings</div>;

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-ZA');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-semibold text-blue-900">Bookings ({filtered.length})</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by ref, customer, vehicle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-96"
            />
          </div>
          {/* View Toggle */}
          <div className="flex rounded-lg ">
            <Button
              variant={viewMode === 'card' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('card')}
              className="mr-1.5 rounded-md"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-md"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          {/* Export + New Booking */}
          <Button className="flex items-center cursor-pointer" variant="outline" onClick={exportToCSV}>
            <Download className="w-5 h-5 mr-2" />
            Export CSV
          </Button>
          <Button className="flex items-center" onClick={openCreateModal}>
            <Plus className="w-5 h-5 mr-2" />
            New Booking
          </Button>
        </div>
        
      </div>

      {/* Bookings List */}
      {/* CARD VIEW */}
      {viewMode === 'card' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b: any) => (
            <Card key={b._id} className="p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg">#{b.bookingRef}</p>
                  <p className="text-sm text-gray-600">
                    <User className="inline w-4 h-4 mr-1" />
                    {b.user?.name || 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={b.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                    {b.paymentStatus}
                  </Badge>
                  <Badge className="ml-2" variant={b.status === 'confirmed' ? 'default' : 'outline'}>
                    {b.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-gray-500" />
                  {b.vehicle?.make} {b.vehicle?.model}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  {formatDate(b.startDate)} → {formatDate(b.endDate)}
                </p>
              </div>

              <div className="flex justify-between items-end mt-6">
                <p className="text-2xl font-bold">R{b.totalPrice}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium">Ref</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Vehicle</th>
                  <th className="text-left p-4 font-medium">Dates</th>
                  <th className="text-left p-4 font-medium">Amount</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b: any) => (
                  <tr key={b._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-mono">#{b.bookingRef}</td>
                    <td className="p-4">{b.user?.name || 'N/A'}</td>
                    <td className="p-4">{b.vehicle?.make} {b.vehicle?.model}</td>
                    <td className="p-4">
                      {formatDate(b.startDate)} → {formatDate(b.endDate)}
                    </td>
                    <td className="p-4 font-bold">R{b.totalPrice}</td>
                    <td className="p-4">
                      <Badge variant={b.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                        {b.paymentStatus}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="outline" className="mr-2">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'Create'} Booking</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Vehicle Picker */}
            <div>
              <Label>Vehicle</Label>
              <Popover open={vehicleOpen} onOpenChange={setVehicleOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full flex justify-between">
                    {form.vehicleId
                      ? `${vehicles.find((v: any) => v._id === form.vehicleId)?.make} ${
                          vehicles.find((v: any) => v._id === form.vehicleId)?.model
                        }`
                      : 'Select vehicle...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 flex" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search vehicles..." />
                    <CommandEmpty>No vehicle found.</CommandEmpty>
                    <CommandGroup>
                      {vehicles.map((v: any) => (
                        <CommandItem
                          key={v._id}
                          onSelect={() => {
                            setForm({ ...form, vehicleId: v._id });
                            setVehicleOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              form.vehicleId === v._id ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                          {v.make} {v.model} • {v.licensePlate}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* User Picker + Create */}
            <div>
              <Label>Customer</Label>
              <Popover open={userOpen} onOpenChange={setUserOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full flex justify-between">
                    {form.userId
                      ? users.find((u: any) => u._id === form.userId)?.name || 'Select user...'
                      : 'Select or create customer...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandEmpty>
                      <div className="p-4 text-center">
                        <p className="text-sm text-gray-500 mb-3">No user found</p>
                        {!creatingUser ? (
                          <Button size="sm" onClick={() => setCreatingUser(true)}>
                            + Create New User
                          </Button>
                        ) : (
                          <div className="space-y-2">
                            <Input
                              placeholder="Name"
                              value={newUserName}
                              onChange={(e) => setNewUserName(e.target.value)}
                            />
                            <Input
                              placeholder="Email"
                              value={newUserEmail}
                              onChange={(e) => setNewUserEmail(e.target.value)}
                            />
                            <Button size="sm" onClick={handleCreateUser} className="w-full">
                              Create & Select
                            </Button>
                          </div>
                        )}
                      </div>
                    </CommandEmpty>
                    <CommandGroup>
                      {users.map((u: any) => (
                        <CommandItem
                          key={u._id}
                          onSelect={() => {
                            setForm({ ...form, userId: u._id });
                            setUserOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              form.userId === u._id ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                          {u.name} • {u.email}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Dates & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>End Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>

            {/* TOTAL PRICE - AUTO CALCULATED */}
      <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-blue-900">Total Price</span>
          <span className="text-3xl font-bold text-blue-700">
            SBD{(() => {
              if (!form.vehicleId || !form.startDate || !form.endDate) return '0';
              const vehicle = vehicles.find((v: any) => v._id === form.vehicleId);
              if (!vehicle) return '0';

              const start = new Date(form.startDate);
              const end = new Date(form.endDate);
              const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;

              return (days * vehicle.pricePerDay).toLocaleString();
            })()}
          </span>
        </div>
        <p className="text-sm text-blue-600 mt-1">
          {(() => {
            if (!form.startDate || !form.endDate) return '';
            const days = Math.ceil(
              (new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) /
                (1000 * 60 * 60 * 24)
            ) || 1;
            return `${days} day${days > 1 ? 's' : ''} × SBD${
              vehicles.find((v: any) => v._id === form.vehicleId)?.pricePerDay || 0
            }/day`;
          })()}
        </p>
      </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Booking Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Status</Label>
                <Select value={form.paymentStatus} onValueChange={(v) => setForm({ ...form, paymentStatus: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
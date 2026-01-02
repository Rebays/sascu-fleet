// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Vehicle types mapping - backend to display
export const VEHICLE_TYPE_DISPLAY: Record<string, string> = {
  car: 'Car',
  bike: 'Bike',
  scooter: 'Scooter',
  truck: 'Truck',
};

// Vehicle types for search (backend enum values)
export const VEHICLE_TYPES = ['car', 'bike', 'scooter', 'truck'] as const;

// Pickup/Dropoff Locations (to be moved to backend later)
export const LOCATIONS = [
  { value: 'main', label: 'Main Office - Downtown' },
  { value: 'airport', label: 'Airport Branch' },
  { value: 'north', label: 'North Side Location' },
  { value: 'south', label: 'South Side Location' },
];

// Booking status display
export const BOOKING_STATUS_DISPLAY: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

// Payment status display
export const PAYMENT_STATUS_DISPLAY: Record<string, string> = {
  pending: 'Pending',
  partial: 'Partially Paid',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
};

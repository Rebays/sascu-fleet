// Vehicle interface matching backend schema with frontend extensions
export interface Vehicle {
  _id?: string;
  make: string;
  model: string;
  year: number;
  type: 'car' | 'bike' | 'scooter' | 'truck';
  licensePlate: string;
  pricePerHour: number;
  pricePerDay: number;
  location: string;
  isAvailable: boolean;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  // Additional frontend properties (not in backend schema)
  slug?: string;
  description?: string;
  features?: string[];
  seats?: number;
  fuelType?: string;
  transmission?: string;
}

// Booking interface matching backend schema
export interface Booking {
  _id?: string;
  user?: string;
  vehicle: string | Vehicle;
  startDate: string;
  endDate: string;
  totalPrice: number;
  bookingRef?: string;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'failed' | 'refunded';
  createdAt?: string;
  updatedAt?: string;
}

// Dummy data matching backend schema
const VEHICLES: Vehicle[] = [
  {
    make: "Nissan",
    model: "X-Trail",
    year: 2022,
    type: "car",
    licensePlate: "SI-1234",
    pricePerHour: 15,
    pricePerDay: 120,
    location: "Honiara",
    isAvailable: true,
    slug: "nissan-xtrail",
    description: "A comfortable and spacious SUV perfect for family trips and adventures.",
    features: ["4WD", "Air Conditioning", "Bluetooth", "Backup Camera", "Cruise Control"],
    seats: 5,
    fuelType: "diesel",
    transmission: "automatic",
  },
  {
    make: "Toyota",
    model: "Corolla",
    year: 2023,
    type: "car",
    licensePlate: "SI-5678",
    pricePerHour: 10,
    pricePerDay: 80,
    location: "Honiara",
    isAvailable: true,
    slug: "toyota-corolla",
    description: "Reliable and fuel-efficient sedan, ideal for city driving and daily commutes.",
    features: ["Air Conditioning", "Bluetooth", "USB Ports", "Power Windows"],
    seats: 5,
    fuelType: "petrol",
    transmission: "automatic",
  },
  {
    make: "Honda",
    model: "CR-V",
    year: 2021,
    type: "car",
    licensePlate: "SI-9012",
    pricePerHour: 18,
    pricePerDay: 150,
    location: "Honiara",
    isAvailable: true,
    slug: "honda-crv",
    description: "Spacious SUV with excellent fuel economy and modern features.",
    features: ["7 Seater", "Sunroof", "Lane Assist", "Apple CarPlay"],
    seats: 7,
    fuelType: "hybrid",
    transmission: "automatic",
  },
  {
    make: "Mazda",
    model: "3",
    year: 2023,
    type: "car",
    licensePlate: "SI-3456",
    pricePerHour: 9,
    pricePerDay: 70,
    location: "Honiara",
    isAvailable: false,
    slug: "mazda-3",
    description: "Stylish and sporty compact car with excellent handling.",
    features: ["Sport Mode", "Air Conditioning", "Alloy Wheels", "LED Headlights"],
    seats: 5,
    fuelType: "petrol",
    transmission: "manual",
  },
  {
    make: "Ford",
    model: "Ranger",
    year: 2022,
    type: "truck",
    licensePlate: "SI-7890",
    pricePerHour: 22,
    pricePerDay: 180,
    location: "Honiara",
    isAvailable: true,
    slug: "ford-ranger",
    description: "Powerful pickup truck perfect for heavy-duty tasks and off-road adventures.",
    features: ["4WD", "Tow Bar", "Bed Liner", "Hill Descent Control", "Turbo Diesel"],
    seats: 5,
    fuelType: "diesel",
    transmission: "automatic",
  },
  {
    make: "Hyundai",
    model: "Tucson",
    year: 2023,
    type: "car",
    licensePlate: "SI-2345",
    pricePerHour: 14,
    pricePerDay: 110,
    location: "Honiara",
    isAvailable: true,
    slug: "hyundai-tucson",
    description: "Modern SUV with advanced safety features and comfortable interior.",
    features: ["Smart Cruise Control", "Wireless Charging", "Panoramic Sunroof", "360 Camera"],
    seats: 5,
    fuelType: "petrol",
    transmission: "automatic",
  },
];

// Simulated bookings storage (in a real app, this would be in a database)
let bookings: Booking[] = [];

export function getAllVehicles(): Vehicle[] {
  return VEHICLES;
}

export function getVehicleBySlug(slug: string): Vehicle | null {
  return VEHICLES.find((vehicle) => vehicle.slug === slug) || null;
}

export function getAvailableVehicles(): Vehicle[] {
  return VEHICLES.filter((vehicle) => vehicle.isAvailable);
}

export function createBooking(bookingData: Omit<Booking, "id" | "createdAt" | "status">): Booking {
  const newBooking: Booking = {
    ...bookingData,
    id: `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  bookings.push(newBooking);
  return newBooking;
}

export function getBookingById(id: string): Booking | null {
  return bookings.find((booking) => booking.id === id) || null;
}

export function calculateTotalPrice(pricePerDay: number, startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return days * pricePerDay;
}

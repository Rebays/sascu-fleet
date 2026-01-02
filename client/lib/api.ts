import { API_URL } from './constants';
import type { Vehicle, VehicleDisplay } from './types';

// Helper function to handle API errors
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper to transform Vehicle to VehicleDisplay
function transformVehicle(vehicle: Vehicle): VehicleDisplay {
  return {
    ...vehicle,
    displayName: `${vehicle.make} ${vehicle.model}`,
  };
}

/**
 * Vehicle API Functions
 */

/**
 * Get all available vehicles
 * Maps to: GET /api/vehicles
 */
export async function getVehicles(): Promise<VehicleDisplay[]> {
  try {
    const response = await fetch(`${API_URL}/vehicles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Enable credentials if using cookies for auth later
      // credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        error.message || 'Failed to fetch vehicles',
        response.status,
        error
      );
    }

    const vehicles: Vehicle[] = await response.json();
    return vehicles.map(transformVehicle);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Network error: Unable to connect to the server. Please check your connection.',
      undefined,
      error
    );
  }
}

/**
 * Get a single vehicle by ID
 * Maps to: GET /api/vehicles/:id
 */
export async function getVehicleById(id: string): Promise<VehicleDisplay> {
  try {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        error.message || 'Failed to fetch vehicle',
        response.status,
        error
      );
    }

    const vehicle: Vehicle = await response.json();
    return transformVehicle(vehicle);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Network error: Unable to connect to the server. Please check your connection.',
      undefined,
      error
    );
  }
}

/**
 * Filter vehicles by type
 * Note: This is client-side filtering since backend doesn't support type filtering yet
 */
export async function getVehiclesByType(type?: string): Promise<VehicleDisplay[]> {
  const vehicles = await getVehicles();

  if (!type) {
    return vehicles;
  }

  return vehicles.filter(vehicle => vehicle.type === type);
}

/**
 * Search vehicles (client-side filtering for now)
 * TODO: Replace with backend endpoint when available
 * Backend needs: GET /api/vehicles/search?startDate=...&endDate=...&type=...
 */
export interface VehicleSearchParams {
  startDate?: string;
  endDate?: string;
  type?: string;
  location?: string;
}

export async function searchVehicles(params: VehicleSearchParams): Promise<VehicleDisplay[]> {
  // For now, fetch all vehicles and filter client-side
  // In production, this should be a backend endpoint that checks actual availability
  const vehicles = await getVehicles();

  let filtered = vehicles;

  // Filter by type if specified
  if (params.type) {
    filtered = filtered.filter(v => v.type === params.type);
  }

  // Filter by location if specified
  if (params.location) {
    filtered = filtered.filter(v => v.location === params.location);
  }

  // TODO: Filter by date range
  // This requires backend support to check against existing bookings
  // For now, we just return vehicles marked as available
  filtered = filtered.filter(v => v.isAvailable);

  return filtered;
}

/**
 * Calculate booking price
 * Helper function to calculate total price based on dates
 */
export function calculateBookingPrice(
  vehicle: VehicleDisplay,
  startDate: string,
  endDate: string
): { days: number; hours: number; totalPrice: number; priceType: 'daily' | 'hourly' } {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffMs = end.getTime() - start.getTime();
  const hours = diffMs / (1000 * 60 * 60);
  const days = hours / 24;

  // Use daily rate if >= 1 day, otherwise hourly
  if (days >= 1) {
    return {
      days: Math.ceil(days),
      hours,
      totalPrice: Math.ceil(days) * vehicle.pricePerDay,
      priceType: 'daily',
    };
  } else {
    return {
      days,
      hours: Math.ceil(hours),
      totalPrice: Math.ceil(hours) * vehicle.pricePerHour,
      priceType: 'hourly',
    };
  }
}

/**
 * Booking API Functions
 */

export interface GuestBookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  pickupLocation?: string;
  additionalNotes?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    bookingRef: string;
    booking: any;
    customerInfo: {
      name: string;
      email: string;
      phone: string;
      licenseNumber: string;
    };
  };
}

export interface TrackingResponse {
  success: boolean;
  data: {
    bookingRef: string;
    status: string;
    paymentStatus: string;
    vehicle: {
      make: string;
      model: string;
      year: number;
      licensePlate: string;
      location: string;
    };
    customer: {
      name: string;
      email: string;
      phone: string;
    };
    dates: {
      startDate: string;
      endDate: string;
      createdAt: string;
    };
    pricing: {
      totalPrice: number;
      deposit: number;
      balance: number;
    };
  };
  message?: string;
}

/**
 * Create a guest booking (no authentication required)
 * Maps to: POST /api/bookings
 */
export async function createGuestBooking(
  bookingData: GuestBookingData
): Promise<BookingResponse> {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        error.message || 'Failed to create booking',
        response.status,
        error
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Network error: Unable to connect to the server. Please check your connection.',
      undefined,
      error
    );
  }
}

/**
 * Track booking by reference number (public)
 * Maps to: GET /api/bookings/track/:bookingRef
 */
export async function trackBooking(bookingRef: string): Promise<TrackingResponse> {
  try {
    const response = await fetch(`${API_URL}/bookings/track/${bookingRef}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        error.message || 'Booking not found',
        response.status,
        error
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Network error: Unable to connect to the server. Please check your connection.',
      undefined,
      error
    );
  }
}

/**
 * Export the ApiError class for use in components
 */
export { ApiError };

// API service layer for backend communication
// Note: This is configured for future backend integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Vehicle API
export const vehicleApi = {
  // GET /api/vehicles - Get all available vehicles
  getAll: () => apiCall<any[]>('/vehicles'),

  // GET /api/vehicles/:id - Get vehicle by ID
  getById: (id: string) => apiCall<any>(`/vehicles/${id}`),
};

// Booking API
export const bookingApi = {
  // POST /api/bookings - Create a new booking
  create: (bookingData: {
    vehicleId: string;
    startDate: string;
    endDate: string;
  }) => apiCall<any>('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),

  // GET /api/bookings/my - Get user's bookings
  getMyBookings: (token: string) => apiCall<any[]>('/bookings/my', {
    headers: { Authorization: `Bearer ${token}` },
  }),

  // GET /api/bookings/:id - Get booking by ID
  getById: (id: string, token: string) => apiCall<any>(`/bookings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  }),
};

// Auth API
export const authApi = {
  // POST /api/auth/register - Register new user
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => apiCall<{ token: string; user: any }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // POST /api/auth/login - Login user
  login: (credentials: { email: string; password: string }) =>
    apiCall<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  // GET /api/auth/me - Get current user
  getCurrentUser: (token: string) =>
    apiCall<any>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default {
  vehicles: vehicleApi,
  bookings: bookingApi,
  auth: authApi,
};

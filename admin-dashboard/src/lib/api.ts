import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  let token: string | null = null;

  // 1. First try cookie (works on server + client)
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(^|;) ?token=([^;]*)(;|$)/);
    token = match ? match[2] : null;
  }

  // 2. Fallback to localStorage (only client)
  if (!token && typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Optional: Auto logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; max-age=0';
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// For SWR
export const fetcher = (url: string) =>
  api.get(url).then((res) => res.data);
import axios from 'axios';

// Use Vercel environment variable or fallback to Render backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
                     process.env.REACT_APP_API_BASE_URL || 
                     'https://codewithamul-blogify.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error: Cannot connect to backend server');
      console.error('Make sure your backend is running at:', API_BASE_URL);
    }
    
    // Handle specific status codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized: Please login again');
          break;
        case 403:
          console.error('Forbidden: You do not have permission');
          break;
        case 404:
          console.error('Not Found: API endpoint does not exist');
          break;
        case 500:
          console.error('Server Error: Backend server issue');
          break;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
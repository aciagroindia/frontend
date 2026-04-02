import axios from 'axios';

const axiosInstance = axios.create({
    // Jab aap deploy karenge, toh bas yahan URL badalna hoga
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    timeout: 30000, // 30 seconds tak response nahi aaya toh request cancel
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor: Agar aapke paas token hai, toh ye har request mein apne aap bhej dega
axiosInstance.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem('token') : null; // Client-side check ke liye
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Token expire / Unauthorized handle karne ke liye
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // FIX: Check karein ki error kis API URL se aaya hai
      const requestUrl = error.config?.url || "";
      
      // Agar error Password Change ya Login route se nahi aaya hai, tabhi logout karein
      if (!requestUrl.includes('/password') && !requestUrl.includes('/login')) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
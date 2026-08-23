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
    const status = error?.response?.status;
    const requestUrl = error.config?.url || "";

    if (status === 401 || (status === 403 && requestUrl.includes('/admin/'))) {
      if (!requestUrl.includes('/password') && !requestUrl.includes('/login') && !requestUrl.includes('/orders')) {
        if (typeof window !== 'undefined') {
          const isCurrentAdminPage = window.location.pathname.startsWith('/admin') && 
                                     window.location.pathname !== '/admin/login' && 
                                     window.location.pathname !== '/admin/request-access' &&
                                     window.location.pathname !== '/admin/waiting';

          if (isCurrentAdminPage) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/admin/login';
          } else if (status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
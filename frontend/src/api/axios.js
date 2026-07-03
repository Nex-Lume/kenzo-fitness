import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://kenzo-fitness.onrender.com/api',
});

// Add interceptor to append authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kenzofitness_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('kenzofitness_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Create a utility file: src/utils/api.js
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

// Create an axios instance with authentication
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add the token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
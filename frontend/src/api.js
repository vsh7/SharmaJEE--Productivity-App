import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

// Production backend URL - deployed on Render
// For local development, use: http://10.118.143.215:3000 (or your local IP)
const BASE_URL = 'https://productivity-app-a100.onrender.com'; // Production backend on Render
// const BASE_URL = 'http://10.118.143.215:3000'; // Local backend (use for testing)

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 60000, // 60 second timeout for Render cold starts
});

// Interceptor to automatically add the JWT token to every request
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout - Server took too long to respond');
        } else if (error.message === 'Network Error') {
            console.error('Network Error - Check if backend is running and IP is correct');
            console.error('Current API URL:', BASE_URL);
        }
        return Promise.reject(error);
    }
);

export default api;

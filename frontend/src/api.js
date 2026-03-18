import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

// IMPORTANT: Update this IP address to match your computer's local IP
// To find your IP: Run `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
// Current IP: 10.118.143.215 (Updated: 2026-03-18)

const getBaseURL = () => {
    if (Platform.OS === 'android') {
        // Android emulator uses 10.0.2.2 to access host machine's localhost
        return 'http://10.0.2.2:3000';
    } else {
        // For physical iOS devices and simulators, use your computer's local IP
        return 'http://10.118.143.215:3000';
    }
};

const BASE_URL = getBaseURL();

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 second timeout
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

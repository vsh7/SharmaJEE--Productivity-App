import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Replace with your computer's local Wi-Fi IP address
// Found via testing: 10.19.145.215
const BASE_URL = 'http://10.61.73.215:3000';

const api = axios.create({
    baseURL: BASE_URL,
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

export default api;

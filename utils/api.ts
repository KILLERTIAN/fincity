import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

/**
 * Configure base URL.
 * Automatically detects the manifest host to work on both simulators and physical devices.
 */
const getBaseUrl = () => {
    if (__DEV__) {
        // Get the IP of the machine running the local server
        const debuggerHost = Constants.expoConfig?.hostUri;
        const localhost = debuggerHost?.split(':')[0] || 'localhost';
        return `http://${localhost}:3001/api`;
    }
    return 'https://your-production-server.com/api';
};

const API_BASE_URL = getBaseUrl();

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error getting auth token:', error);
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, check if we should clear storage
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                await AsyncStorage.removeItem('authToken');
                await AsyncStorage.removeItem('userId');
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    register: async (name: string, email?: string, password?: string, avatar?: string) => {
        const response = await api.post('/auth/register', { name, email, password, avatar });
        if (response.data.token) {
            await AsyncStorage.setItem('authToken', response.data.token);
            await AsyncStorage.setItem('userId', response.data.user.id);
        }
        return response.data;
    },

    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            await AsyncStorage.setItem('authToken', response.data.token);
            await AsyncStorage.setItem('userId', response.data.user.id);
        }
        return response.data;
    },

    guestLogin: async (name: string, avatar?: string) => {
        const response = await api.post('/auth/guest', { name, avatar });
        if (response.data.token) {
            await AsyncStorage.setItem('authToken', response.data.token);
            await AsyncStorage.setItem('userId', response.data.user.id);
        }
        return response.data;
    },

    logout: async () => {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userId');
    },

    isLoggedIn: async () => {
        const token = await AsyncStorage.getItem('authToken');
        return !!token;
    }
};

// User API
export const userApi = {
    getProfile: async () => {
        const response = await api.get('/user/profile');
        return response.data;
    },

    updateProfile: async (data: { name?: string; avatar?: string }) => {
        const response = await api.put('/user/profile', data);
        return response.data;
    },

    getTransactions: async (limit = 50, offset = 0, type?: string) => {
        const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
        if (type) params.append('type', type);
        const response = await api.get(`/user/transactions?${params}`);
        return response.data;
    },

    createTransaction: async (data: {
        type: string;
        amount: number;
        description: string;
        buildingId?: string;
        buildingType?: string;
    }) => {
        const response = await api.post('/user/transactions', data);
        return response.data;
    },

    getStocks: async () => {
        const response = await api.get('/user/stocks');
        return response.data;
    },

    buyStock: async (stockSymbol: string, stockName: string, quantity: number, price: number) => {
        const response = await api.post('/user/stocks/buy', { stockSymbol, stockName, quantity, price });
        return response.data;
    },

    sellStock: async (stockSymbol: string, quantity: number, price: number) => {
        const response = await api.post('/user/stocks/sell', { stockSymbol, quantity, price });
        return response.data;
    },

    getQuizAttempts: async () => {
        const response = await api.get('/user/quizzes');
        return response.data;
    },

    submitQuizResult: async (data: {
        quizId: string;
        quizTitle: string;
        score: number;
        totalQuestions: number;
        xpEarned: number;
        timeTaken?: number;
    }) => {
        const response = await api.post('/user/quizzes/complete', data);
        return response.data;
    },

    addToSavings: async (goalId: string, amount: number) => {
        const response = await api.post(`/user/savings/${goalId}/add`, { amount });
        return response.data;
    },

    // Transfer money functions
    searchUsers: async (query: string) => {
        const response = await api.get(`/user/friends/search?query=${encodeURIComponent(query)}`);
        return response.data;
    },

    getUserById: async (userId: string) => {
        const response = await api.get(`/user/friends/${userId}`);
        return response.data;
    },

    sendMoney: async (recipientId: string, amount: number, message?: string) => {
        const response = await api.post('/user/transfer/send', { recipientId, amount, message });
        return response.data;
    },

    requestMoney: async (recipientId: string, amount: number, message?: string) => {
        const response = await api.post('/user/transfer/request', { recipientId, amount, message });
        return response.data;
    },

    getTransferHistory: async (limit = 20, offset = 0) => {
        const response = await api.get(`/user/transfer/history?limit=${limit}&offset=${offset}`);
        return response.data;
    }
};

// City API (Building interactions)
export const cityApi = {
    getBuildingInfo: async (buildingType: string) => {
        const response = await api.get(`/city/${buildingType}/info`);
        return response.data;
    },

    interact: async (buildingType: string, action: string, amount?: number) => {
        const response = await api.post(`/city/${buildingType}/interact`, { action, amount });
        return response.data;
    },

    bank: {
        deposit: (amount: number) => cityApi.interact('bank', 'deposit', amount),
        withdraw: (amount: number) => cityApi.interact('bank', 'withdraw', amount),
        getBalance: () => cityApi.interact('bank', 'view_balance'),
    },

    market: {
        buyFood: () => cityApi.interact('market', 'buy_food'),
        buySupplies: () => cityApi.interact('market', 'buy_supplies'),
    },

    home: {
        rest: () => cityApi.interact('home', 'rest'),
        viewStats: () => cityApi.interact('home', 'view_stats'),
    },

    office: {
        work: () => cityApi.interact('guild', 'work'),
    },

    hospital: {
        heal: () => cityApi.interact('hospital', 'heal'),
        emergencyFund: () => cityApi.interact('hospital', 'emergency_fund'),
    },

    gym: {
        workout: () => cityApi.interact('gym', 'workout'),
    }
};

export default api;

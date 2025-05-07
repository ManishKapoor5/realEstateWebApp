import { create } from 'zustand';
import axios from 'axios';
import { LimitConfigState, LimitConfig, TierLimit, UserTier } from '../types';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "https://realestatesite-backend.onrender.com/api/v1";

// Create a consistent axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor to include authorization headers automatically
apiClient.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh automatically
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Prevent infinite refresh loops
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      originalRequest.url !== '/RealEstateUser/refresh-token'
    ) {
      originalRequest._retry = true;
      console.log('401 Unauthorized, attempting to refresh token');
      
      try {
        const refreshToken = useAuthStore.getState().getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Use a new axios instance for token refresh to avoid interceptors
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/RealEstateUser/refresh-token`, 
          { refreshToken },
          {
            baseURL: API_BASE_URL,
            headers: { 'Content-Type': 'application/json' }
          }
        );
        
        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
        useAuthStore.getState().setTokens(accessToken, newRefreshToken);
        console.log('Token refreshed successfully:', accessToken);
        
        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        useAuthStore.getState().logout();
        return Promise.reject(new Error('Session expired, please log in again'));
      }
    }
    
    // Log API errors
    const errorDetails = {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    };
    
    // Attempt to extract error message from HTML response
    if (typeof errorDetails.data === 'string' && errorDetails.data.includes('<html')) {
      const match = errorDetails.data.match(/<pre>(.*?)<\/pre>/s);
      errorDetails.data = match ? match[1] : 'HTML error response';
    }
    
    console.error('API Error:', errorDetails);
    return Promise.reject(error);
  }
);

// Default configuration as fallback with properly typed UserTier values
const defaultLimitConfig: LimitConfig = {
  tiers: [
    { 
      id: 'free' as UserTier, 
      name: 'Free Tier', 
      propertyLimit: 5,
      description: 'Basic account with limited access'
    },
    { 
      id: 'standard' as UserTier, 
      name: 'Standard Tier', 
      propertyLimit: 15,
      description: 'Paid subscription with moderate access',
      price: 499
    },
    { 
      id: 'premium' as UserTier, 
      name: 'Premium Tier', 
      propertyLimit: 30,
      description: 'Premium subscription with expanded access',
      price: 999
    },
    { 
      id: 'enterprise' as UserTier, 
      name: 'Enterprise Tier', 
      propertyLimit: 100,
      description: 'Full access for enterprise clients',
      price: 2499
    },
    { 
      id: 'agent' as UserTier, 
      name: 'Agent Partnership', 
      propertyLimit: 50,
      description: 'For partnered real estate agents',
      price: 1499
    }
  ],
  showLimitExceededNotice: true,
  allowWaitlist: true
};

export const useLimitConfigStore = create<LimitConfigState>((set, get) => ({
  limitConfig: defaultLimitConfig,
  isLoading: false,
  error: null,
  
  fetchLimitConfig: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log('Fetching limit config from API');
      
      const response = await apiClient.get<LimitConfig>('/config/property-limits');
      console.log('Fetched limit config:', response.data);
      set({ limitConfig: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch property limit configuration';
      console.error('Error fetching limit config:', error);
      set({ isLoading: false, error: errorMessage });

      // In development, try to load from localStorage as fallback
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Attempting to load from localStorage');
        const savedConfig = localStorage.getItem('devLimitConfig');
        if (savedConfig) {
          try {
            const parsedConfig: LimitConfig = JSON.parse(savedConfig);
            console.log('Loaded saved config from localStorage:', parsedConfig);
            set({ limitConfig: parsedConfig });
            return parsedConfig;
          } catch (e) {
            console.error('Failed to parse saved config:', e);
          }
        }
      }
      
      return get().limitConfig;
    }
  },

  updateLimitConfig: async (config: LimitConfig) => {
    try {
      const userRole = useAuthStore.getState().getUserRole();
      console.log('userRole value----->', userRole);
      useAuthStore.getState().debugState(); // Log auth state for debugging
      
      if (userRole !== 'admin') {
        throw new Error('Unauthorized: Only admins can update limit configuration');
      }

      set({ isLoading: true, error: null });
      console.log('Updating limit config:', config);
      
      const response = await apiClient.put<LimitConfig>('/config/property-limits', config);
      console.log('Updated limit config response:', response.data);
      set({ limitConfig: response.data, isLoading: false });
      
      // Save to localStorage in development mode for consistency
      if (process.env.NODE_ENV === 'development') {
        localStorage.setItem('devLimitConfig', JSON.stringify(response.data));
        console.log('Development mode: Saved updated config to localStorage');
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message.includes('token failed') 
          ? 'Authentication failed: Invalid token'
          : error.message 
        : 'Failed to update property limit configuration';
      console.error('Error updating limit config:', error);
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  clearError: () => set({ error: null }),

  getTierById: (tierId: UserTier) => {
    return get().limitConfig.tiers.find(tier => tier.id === tierId);
  },

  getUserPropertyLimit: (tierId: UserTier) => {
    const tier = get().getTierById(tierId);
    return tier ? tier.propertyLimit : 0;
  },

  initialize: async () => {
    // First try to load from localStorage in development mode
    if (process.env.NODE_ENV === 'development') {
      const savedConfig = localStorage.getItem('devLimitConfig');
      if (savedConfig) {
        try {
          const parsedConfig: LimitConfig = JSON.parse(savedConfig);
          console.log('Initialized with config from localStorage:', parsedConfig);
          set({ limitConfig: parsedConfig });
          return;
        } catch (e) {
          console.error('Failed to parse saved config:', e);
        }
      }
    }
    
    // If no localStorage data or not in development, fetch from API
    await get().fetchLimitConfig();
  },

  initializeFromLocalStorage: () => {
    if (process.env.NODE_ENV === 'development') {
      const savedConfig = localStorage.getItem('devLimitConfig');
      if (savedConfig) {
        try {
          const parsedConfig: LimitConfig = JSON.parse(savedConfig);
          console.log('Loaded saved config from localStorage:', parsedConfig);
          set({ limitConfig: parsedConfig });
        } catch (e) {
          console.error('Failed to parse saved config:', e);
        }
      }
    }
  }
}));
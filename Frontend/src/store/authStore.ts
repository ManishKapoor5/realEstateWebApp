import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface User {
  _id: string;
  fullName?: string;
  email: string;
  contactNumber: string | number;
  role: 'buyer' | 'seller' | 'agent' | 'admin';
  tier: UserTier;
  status?: 'pending' | 'active' | 'inactive';
}


export type UserTier = 'free' | 'standard' | 'premium' | 'enterprise' | 'agent';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  // Methods
  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  logout: () => void;
  getUserRole: () => string | null;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  debugState: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      
      setAuth: (accessToken, refreshToken, user) => {
        // Simply set the state - backend validation is trusted
        set({ 
          accessToken, 
          refreshToken, 
          user,
          isAuthenticated: true
        });
      },
      
      setTokens: (accessToken, refreshToken) => {
        // Just update the tokens
        set({ 
          accessToken, 
          refreshToken,
          isAuthenticated: true
        });
      },
      
      setAccessToken: (accessToken) => {
        set({ accessToken, isAuthenticated: true });
      },
      
      setRefreshToken: (refreshToken) => {
        set({ refreshToken });
      },

      logout: () => {
        set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null,
          isAuthenticated: false 
        });
      },
      
      getUserRole: () => {
        const { user } = get();
        return user?.role || null;
      },
      
      getAccessToken: () => get().accessToken,
      
      getRefreshToken: () => get().refreshToken,
      debugState: () => {
        const state = get();
        console.log('Auth Store State:', state);
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

// Simple initialization - just check if we have a token
export const initializeAuth = () => {
  const { accessToken } = useAuthStore.getState();
  
  if (accessToken) {
    useAuthStore.setState({ isAuthenticated: true });
  } else {
    useAuthStore.setState({ isAuthenticated: false });
  }
};
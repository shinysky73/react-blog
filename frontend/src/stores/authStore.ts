import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface User {
  id: number;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (user, token) => {
        set({ isAuthenticated: true, user, token });
      },
      logout: () => {
        set({ isAuthenticated: false, user: null, token: null });
      },
      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          return;
        }

        try {
          // The api interceptor will use the token from the store
          const response = await api.get('/users/profile');
          // If token is valid, user is fetched and state is updated
          set({ isAuthenticated: true, user: response.data });
        } catch (error) {
          console.error('Token validation failed, logging out.', error);
          // If token is invalid, logout
          set({ isAuthenticated: false, user: null, token: null });
        }
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    },
  ),
);

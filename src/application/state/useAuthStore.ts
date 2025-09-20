import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  username: string;
  email: string;
  registrationDate: string;
  lastLoginDate: string;
  isEmailConfirmed: boolean;
  isActive: boolean;
  personId: number;
  person: {
    id: number;
    firstName: string;
    lastName: string;
    document: number;
    phoneNumber: number;
  };
  role?: 'tourist' | 'provider' | 'admin';
  avatar?: string;
  isVerified?: boolean;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  setFromStorage: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Acciones
      setAuth: (token: string, user: User) => {
        localStorage.setItem('wildtour-token', token);
        localStorage.setItem('wildtour-user', JSON.stringify(user));

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        localStorage.removeItem('wildtour-token');
        localStorage.removeItem('wildtour-user');

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          localStorage.setItem('wildtour-user', JSON.stringify(updatedUser));

          set({
            user: updatedUser,
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearAuth: () => {
        localStorage.removeItem('wildtour-token');
        localStorage.removeItem('wildtour-user');

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setFromStorage: () => {
        const token = localStorage.getItem('wildtour-token');
        const userJson = localStorage.getItem('wildtour-user');

        if (token && userJson) {
          try {
            const user = JSON.parse(userJson);
            set({
              token,
              user,
              isAuthenticated: true,
            });
          } catch (error) {
            console.error('Error parsing user from storage:', error);
            // Limpiar datos corruptos
            localStorage.removeItem('wildtour-token');
            localStorage.removeItem('wildtour-user');
          }
        }
      },
    }),
    {
      name: 'wildtour-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

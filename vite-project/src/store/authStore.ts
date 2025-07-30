// 📁 FE: src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  fullName?: string;  // ✅ Thêm
  roleName?: string;        // ✅ Thêm
  isAdmin?: boolean;        // ✅ Thêm  
  phone?: string;
  address?: string;
  bio?: string;
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean;
  lastLogin?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Đăng nhập thất bại');
          }

          const data: LoginResponse = await response.json();
          
          set({ 
            user: data.user, 
            token: data.token, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Đăng nhập thất bại',
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Đăng ký thất bại');
          }

          const responseData: LoginResponse = await response.json();
          
          set({ 
            user: responseData.user, 
            token: responseData.token, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Đăng ký thất bại',
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
        // Có thể thêm logic để gọi API logout nếu cần
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          set({ user: null, token: null });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Token không hợp lệ');
          }

          const user: User = await response.json();
          set({ user, isLoading: false });
        } catch (error) {
          set({ 
            user: null, 
            token: null, 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Xác thực thất bại'
          });
        }
      },

      updateProfile: async (data: Partial<User>) => {
        const { user, token } = get();
        if (!user || !token) throw new Error('Chưa đăng nhập');

        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/users/${user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Cập nhật thất bại');
          }

          const updatedUser: User = await response.json();
          set({ 
            user: updatedUser, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Cập nhật thất bại',
            isLoading: false 
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
);
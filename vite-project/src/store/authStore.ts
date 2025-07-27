// 📁 FE: src/store/authStore.ts
import { create } from 'zustand';
import { setToken, clearToken } from '@/utils/token';

type User = {
  id: number;
  email: string;
};

type AuthState = {
  user: User | null;
  setUser: (user: User | null, token?: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user, token) => {
    if (user && token) {
      setToken(token);           // ✅ Lưu token vào localStorage
    }
    set({ user });                // ✅ Lưu user vào state
  },
  logout: () => {
    clearToken();                 // ✅ Xóa token
    set({ user: null });          // ✅ Xóa user
  },
}));

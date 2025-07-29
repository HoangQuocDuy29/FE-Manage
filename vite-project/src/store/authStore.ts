// 📁 FE: src/store/authStore.ts
import { create } from 'zustand';
import { setToken, clearToken } from '@/utils/token';

// Cập nhật kiểu User để thêm role dưới dạng chuỗi
type User = {
  id: number;
  email: string;
  role: 'admin' | 'user';  // Thay role_id thành role với kiểu chuỗi
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
      setToken(token);           // Lưu token vào localStorage
    }
    set({ user });                // Lưu user vào state, bao gồm role
  },
  logout: () => {
    clearToken();                 // Xóa token khỏi localStorage
    set({ user: null });          // Xóa user khỏi state
  },
}));

// 📁 FE: src/utils/token.ts

const TOKEN_KEY = 'auth_token';

// Lưu token vào localStorage
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined' && token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

// Lấy token từ localStorage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

// Xóa token khỏi localStorage
export const clearToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Kiểm tra nếu token có tồn tại trong localStorage
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

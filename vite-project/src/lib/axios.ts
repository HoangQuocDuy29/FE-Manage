import axios from 'axios';
import { getToken, clearToken } from '@/utils/token';

// ✅ Tạo instance dùng chung
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // --> Gộp lại thành: http://localhost:3000/api/auth/login
  withCredentials: false,
});

// ✅ Interceptor: Gắn token vào request header
api.interceptors.request.use(
  (config) => {
    const token = getToken(); // dùng từ utils/token.ts
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor: Xử lý khi token hết hạn
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      clearToken(); // xoá token dùng hàm utils
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

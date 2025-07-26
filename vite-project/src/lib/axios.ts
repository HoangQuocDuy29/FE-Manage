import axios from "axios";

// ✅ Tạo axios instance dùng chung
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Nếu khác cổng thì sửa lại
  withCredentials: false,
});

// ✅ Interceptor gửi token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor xử lý token hết hạn
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Chuyển về trang login
    }
    return Promise.reject(error);
  }
);

export default api;

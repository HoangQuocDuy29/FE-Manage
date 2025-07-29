import api from "@/lib/axios";
import { setToken } from "@/utils/token"; // Nhớ tạo và import setToken

// Đăng ký người dùng
export const register = async (data: { email: string; password: string }) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// Đăng nhập và phân quyền người dùng
export const login = async (data: { email: string; password: string }) => {
  const res = await api.post("/auth/login", data);
  
  // Giả sử API trả về một response với cấu trúc { token, user }
  const { token, user } = res.data;

  // Lưu token vào localStorage hoặc cookie
  setToken(token);

  // Trả về token và thông tin người dùng
  return { token, user };
};

import axios from 'axios';
import type { TaskInput } from '../schemas/task.schema';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // đảm bảo đúng cổng backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== TASK APIs (existing) =====
// Lấy toàn bộ danh sách task
export const fetchTasks = (queryString = "") =>
  axios.get(`/api/tasks${queryString ? `?${queryString}` : ""}`);

// Tạo task mới
export const createTask = (data: TaskInput) => api.post('/api/tasks', data);

// Xóa task theo ID
export const deleteTask = (id: number) => api.delete(`/api/tasks/${id}`);

// Cập nhật task theo ID
export const updateTask = (id: number, data: TaskInput) =>
  api.put(`/api/tasks/${id}`, data);

// 🔍 Tìm kiếm task theo ID hoặc tên người nhận (assignee)
export const searchTasks = (query: string) =>
  api.get(`/api/tasks/search?q=${encodeURIComponent(query)}`);

// ===== USER APIs (NEW) =====
export interface CreateUserData {
  email: string;
  password: string;
  username?: string;
  fullName?: string;
  phone?: string;
  department?: string;
  position?: string;
  roleName: 'admin' | 'user';
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  fullName?: string;
  phone?: string;
  department?: string;
  position?: string;
  status?: 'active' | 'inactive' | 'suspended';
  roleName?: 'admin' | 'user';
  password?: string;
}

export interface UserFilters {
  role?: 'admin' | 'user';
  status?: 'active' | 'inactive' | 'suspended';
  search?: string;
  page?: number;
  limit?: number;
}

// GET /api/users - Lấy danh sách users với filters
export const fetchUsers = (filters: UserFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });
  return api.get(`/api/users?${params.toString()}`);
};

// GET /api/users/:id - Lấy 1 user theo ID
export const fetchUser = (id: number) => api.get(`/api/users/${id}`);

// POST /api/users - Tạo user mới
export const createUser = (data: CreateUserData) => api.post('/api/users', data);

// PUT /api/users/:id - Cập nhật user
export const updateUser = (id: number, data: UpdateUserData) => 
  api.put(`/api/users/${id}`, data);

// DELETE /api/users/:id - Xóa user (soft delete)
export const deleteUser = (id: number, hardDelete = false) => 
  api.delete(`/api/users/${id}${hardDelete ? '?hard=true' : ''}`);

// GET /api/users/search - Tìm kiếm users
export const searchUsers = (query: string, page = 1, limit = 10) =>
  api.get(`/api/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);

// GET /api/users/stats - Lấy thống kê users
export const fetchUserStats = () => api.get('/api/users/stats');

// ===== UTILITY: Get users for dropdown =====
export const fetchUsersForDropdown = async () => {
  try {
    const response = await fetchUsers({ status: 'active' });
    return response.data.data.map((user: any) => ({
      id: user.id,
      name: user.fullName || user.username || user.email,
      email: user.email
    }));
  } catch (error) {
    console.error('Error fetching users for dropdown:', error);
    return [];
  }
};
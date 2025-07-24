import axios from 'axios';
import type { TaskInput } from '../schemas/task.schema';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // đảm bảo đúng cổng backend
  headers: {
    'Content-Type': 'application/json',
  },
});

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

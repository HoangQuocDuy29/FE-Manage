import axios from 'axios';
import type { TaskInput } from '../schemas/task.schema';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // nhớ đổi đúng cổng backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Các API cụ thể:
export const fetchTasks = () => api.get('/tasks');
export const createTask = (data: TaskInput) => api.post('/tasks', data);
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);
export const updateTask = (id: number, data: TaskInput) => api.put(`/tasks/${id}`, data);

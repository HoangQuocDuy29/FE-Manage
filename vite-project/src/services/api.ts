// File: src/services/api.ts (UPDATED với improvements và error handling)
import axios, { AxiosError } from 'axios';
import type { TaskInput } from '../schemas/task.schema';

// Create axios instance với cấu hình tối ưu
export const api = axios.create({
  baseURL: 'http://localhost:3000', // đảm bảo đúng cổng backend
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== AXIOS INTERCEPTORS =====

// Request interceptor - thêm auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log API calls trong development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 [API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses trong development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ [API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Log errors trong development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ [API] ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}:`, error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

// ===== TYPE DEFINITIONS =====

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

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  newUsers: number;
  activePercentage: number;
  byRole: {
    admin: number;
    user: number;
  };
  byDepartment: { [key: string]: number };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: {
    timestamp: string;
    duration?: string;
  };
}

export interface User {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  phone?: string;
  department?: string;
  position?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  role: 'admin' | 'user';
  roleName: string;
  roleId: number;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  lastLoginDate?: string;
  formattedSpending: string;
  isActive: boolean;
  isAdmin: boolean;
}

// ===== TASK APIs (existing - enhanced) =====

// Lấy toàn bộ danh sách task
export const fetchTasks = (queryString = "") =>
  api.get(`/api/tasks${queryString ? `?${queryString}` : ""}`);

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

// Lấy task statistics
export const fetchTaskStats = () => api.get('/api/tasks/stats');

// ===== USER APIs (NEW - Enhanced) =====

// GET /api/users - Lấy danh sách users với filters
export const fetchUsers = async (filters: UserFilters = {}): Promise<ApiResponse<{ users: User[]; pagination: any }>> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.append(key, value.toString());
    }
  });
  
  const response = await api.get(`/api/users?${params.toString()}`);
  return response.data;
};

// GET /api/users/:id - Lấy 1 user theo ID
export const fetchUser = async (id: number): Promise<ApiResponse<User>> => {
  const response = await api.get(`/api/users/${id}`);
  return response.data;
};

// POST /api/users - Tạo user mới
export const createUser = async (data: CreateUserData): Promise<ApiResponse<User>> => {
  const response = await api.post('/api/users', data);
  return response.data;
};

// PUT /api/users/:id - Cập nhật user
export const updateUser = async (id: number, data: UpdateUserData): Promise<ApiResponse<User>> => {
  const response = await api.put(`/api/users/${id}`, data);
  return response.data;
};

// DELETE /api/users/:id - Xóa user (soft delete)
export const deleteUser = async (id: number, hardDelete = false): Promise<ApiResponse<{ message: string }>> => {
  const response = await api.delete(`/api/users/${id}${hardDelete ? '?hard=true' : ''}`);
  return response.data;
};

// GET /api/users/search - Tìm kiếm users
export const searchUsers = async (query: string, page = 1, limit = 10): Promise<ApiResponse<{ users: User[]; pagination: any }>> => {
  const response = await api.get(`/api/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  return response.data;
};

// GET /api/users/stats - Lấy thống kê users
export const fetchUserStats = async (): Promise<ApiResponse<UserStats>> => {
  const response = await api.get('/api/users/stats');
  return response.data;
};

// ===== USER UTILITY FUNCTIONS =====

// Get users for dropdown/select components
export const fetchUsersForDropdown = async (includeInactive = false) => {
  try {
    const filters: UserFilters = includeInactive ? {} : { status: 'active' };
    const response = await fetchUsers(filters);
    
    return response.data.users.map((user: User) => ({
      id: user.id,
      value: user.id,
      label: user.fullName || user.username || user.email,
      name: user.fullName || user.username || user.email,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
      role: user.role,
      department: user.department
    }));
  } catch (error) {
    console.error('Error fetching users for dropdown:', error);
    return [];
  }
};

// Get admin users only
export const fetchAdminUsers = async () => {
  try {
    const response = await fetchUsers({ role: 'admin', status: 'active' });
    return response.data.users;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
};

// Get users by department
export const fetchUsersByDepartment = async (department: string) => {
  try {
    const response = await fetchUsers({ 
      search: department, // Assuming search can filter by department
      status: 'active' 
    });
    return response.data.users.filter(user => 
      user.department?.toLowerCase().includes(department.toLowerCase())
    );
  } catch (error) {
    console.error(`Error fetching users by department ${department}:`, error);
    return [];
  }
};

// Bulk operations
export const bulkUpdateUserStatus = async (userIds: number[], status: 'active' | 'inactive' | 'suspended') => {
  try {
    // This would need to be implemented on backend
    const promises = userIds.map(id => updateUser(id, { status }));
    const results = await Promise.allSettled(promises);
    
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    return {
      succeeded,
      failed,
      total: userIds.length,
      message: `Updated ${succeeded}/${userIds.length} users successfully`
    };
  } catch (error) {
    console.error('Error in bulk update:', error);
    throw error;
  }
};

// ===== AUTH APIs (if needed) =====

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export const login = async (credentials: LoginCredentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await api.post('/api/auth/register', data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export const logout = async () => {
  try {
    await api.post('/api/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear tokens regardless of API response
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }
};

// ===== ROLE APIs (if needed) =====

export const fetchRoles = async () => {
  const response = await api.get('/api/roles');
  return response.data;
};

// ===== ERROR HANDLING UTILITIES =====

export const handleApiError = (error: AxiosError) => {
  if (error.response) {
    // Server responded with error status
    const message = (error.response.data as any)?.message || 'An error occurred';
    return {
      status: error.response.status,
      message,
      errors: (error.response.data as any)?.errors || []
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      status: 0,
      message: 'Network error - please check your connection',
      errors: []
    };
  } else {
    // Something else happened
    return {
      status: 0,
      message: error.message || 'Unknown error',
      errors: []
    };
  }
};

// ===== VALIDATION UTILITIES =====

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};

// ===== CACHE UTILITIES (Optional) =====

const cache = new Map();

export const getCachedData = (key: string) => cache.get(key);

export const setCachedData = (key: string, data: any, ttl = 5 * 60 * 1000) => { // 5 minutes default
  cache.set(key, {
    data,
    expires: Date.now() + ttl
  });
};

export const clearCache = () => cache.clear();

// Export default instance
export default api;

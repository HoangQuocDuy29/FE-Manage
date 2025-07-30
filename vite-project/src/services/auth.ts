// File: src/services/auth.ts (UPDATED với better role handling)
import api from "@/lib/axios";
import { setToken, removeToken } from "@/utils/token";

// Interface cho user data
interface User {
  id: number;
  email: string;
  username?: string;
  fullName?: string;
  role: string;
  roleName: string;
  isAdmin: boolean;
  isActive: boolean;
  permissions?: string[];
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

interface RegisterResponse {
  success: boolean;
  user: User;
  message?: string;
}

// Đăng ký người dùng
export const register = async (data: { 
  email: string; 
  password: string;
  fullName?: string;
}): Promise<RegisterResponse> => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Đăng nhập và phân quyền người dùng
export const login = async (data: { 
  email: string; 
  password: string 
}): Promise<LoginResponse> => {
  try {
    const res = await api.post("/auth/login", data);
    
    // Đảm bảo response có cấu trúc đúng
    const { success, token, user, message } = res.data;
    
    if (!success || !token || !user) {
      throw new Error(message || 'Invalid login response');
    }

    // Lưu token vào localStorage
    setToken(token);
    
    // Lưu user info vào localStorage để sử dụng trong app
    localStorage.setItem('user', JSON.stringify(user));
    
    // Log để debug role
    console.log('🔐 Login successful:', {
      email: user.email,
      role: user.role,
      roleName: user.roleName,
      isAdmin: user.isAdmin
    });

    return { success, token, user, message };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async (): Promise<User> => {
  try {
    const res = await api.get("/auth/me");
    
    if (res.data.success) {
      const user = res.data.data;
      // Cập nhật user info trong localStorage
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    
    throw new Error('Failed to get current user');
  } catch (error: any) {
    // Nếu token expired hoặc invalid, clear auth data
    logout();
    throw new Error(error.response?.data?.message || 'Authentication failed');
  }
};

// Đăng xuất
export const logout = async () => {
  try {
    // Gọi API logout (optional)
    await api.post("/auth/logout");
  } catch (error) {
    console.warn('Logout API call failed:', error);
  } finally {
    // Clear all auth data
    removeToken();
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    
    // Redirect to login
    window.location.href = '/login';
  }
};

// Kiểm tra user có phải admin không
export const isAdmin = (): boolean => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    
    const user = JSON.parse(userStr);
    
    // Multiple checks để đảm bảo admin access
    return user.isAdmin === true || 
           user.role === 'admin' || 
           user.roleName === 'admin';
  } catch {
    return false;
  }
};

// Kiểm tra user đã đăng nhập chưa
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Lấy user từ localStorage
export const getStoredUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Kiểm tra permissions (for future use)
export const hasPermission = (permission: string): boolean => {
  try {
    const user = getStoredUser();
    if (!user) return false;
    
    // Admin có tất cả permissions
    if (isAdmin()) return true;
    
    // Check specific permissions
    return user.permissions?.includes(permission) || false;
  } catch {
    return false;
  }
};

// Kiểm tra có thể truy cập route không
export const canAccessRoute = (routePath: string): boolean => {
  if (!isAuthenticated()) return false;
  
  const user = getStoredUser();
  if (!user) return false;
  
  // Admin có thể truy cập mọi route
  if (isAdmin()) {
    console.log('🔐 Admin access granted for:', routePath);
    return true;
  }
  
  // Define route permissions
  const routePermissions: { [key: string]: string[] } = {
    '/users': ['admin'], // Only admin can access user management
    '/mytask': ['admin', 'user'], // Both can access tasks
    '/dashboard': ['admin', 'user'], // Both can access dashboard
    '/profile': ['admin', 'user'], // Both can access profile
  };
  
  const requiredRoles = routePermissions[routePath];
  if (!requiredRoles) return true; // Public route
  
  const hasAccess = requiredRoles.includes(user.role) || 
                   requiredRoles.includes(user.roleName);
  
  console.log('🔐 Route access check:', {
    route: routePath,
    userRole: user.role,
    userRoleName: user.roleName,
    requiredRoles,
    hasAccess
  });
  
  return hasAccess;
};

// Refresh token (if needed)
export const refreshToken = async (): Promise<string> => {
  try {
    const res = await api.post("/auth/refresh");
    const { token } = res.data;
    
    if (token) {
      setToken(token);
      return token;
    }
    
    throw new Error('No token received');
  } catch (error) {
    logout(); // Force re-login
    throw error;
  }
};

// Export auth utilities
export const authUtils = {
  isAdmin,
  isAuthenticated,
  getStoredUser,
  hasPermission,
  canAccessRoute,
  logout
};

export default {
  register,
  login,
  getCurrentUser,
  refreshToken,
  ...authUtils
};

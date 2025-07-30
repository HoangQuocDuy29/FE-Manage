// 📁 FE: src/App.tsx (UPDATED với enhanced authentication & routing)
import type { JSX } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashBoard from './pages/DashBoard';
import MyTask from './pages/MyTask';
import TaskPage from './pages/TaskPage';
import UserPage from './pages/UserPage';
import TicketPage from './pages/TicketPage';
import LogWorkPage from './pages/LogWorkPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';

// Components
import { Toaster } from './components/ui/toaster';
import { MainLayout } from './components/layout/MainLayout';
import { AuthLayout } from './components/layout/AuthLayout';
//import { LoadingSpinner } from './components/ui/loading-spinner';

// Store & Services
import { useAuthStore } from './store/authStore';
import { isAuthenticated, isAdmin, canAccessRoute } from './services/auth';

// Loading Spinner Component (if not exists)
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Enhanced Protected Route Component
function ProtectedRoute({ children, requireAdmin = false }: { 
  children: JSX.Element; 
  requireAdmin?: boolean;
}) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  
  console.log('🔐 ProtectedRoute check:', {
    user: user?.email,
    role: user?.role,
    requireAdmin,
    path: location.pathname
  });
  
  // Check authentication
  if (!user || !isAuthenticated()) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check admin requirement
  if (requireAdmin) {
    const hasAdminAccess = isAdmin();
    console.log('👑 Admin check:', { hasAdminAccess, userRole: user.role });
    
    if (!hasAdminAccess) {
      console.log('⚠️ Not admin, redirecting to /mytask');
      return <Navigate to="/mytask" replace />;
    }
  }
  
  // Check route-specific permissions
  const canAccess = canAccessRoute(location.pathname);
  console.log('🛡️ Route access check:', { path: location.pathname, canAccess });
  
  if (!canAccess) {
    const defaultRoute = isAdmin() ? '/dashboard' : '/mytask';
    console.log(`🚫 Access denied, redirecting to ${defaultRoute}`);
    return <Navigate to={defaultRoute} replace />;
  }
  
  console.log('✅ Access granted');
  return children;
}

// Admin-only Route Component
function AdminRoute({ children }: { children: JSX.Element }) {
  return <ProtectedRoute requireAdmin={true}>{children}</ProtectedRoute>;
}

// Public Route Component (enhanced)
function PublicRoute({ children }: { children: JSX.Element }) {
  const user = useAuthStore((state) => state.user);
  
  // Nếu đã đăng nhập, redirect về trang phù hợp với role
  if (user && isAuthenticated()) {
    const redirectTo = isAdmin() ? '/dashboard' : '/mytask';
    console.log(`🔄 Already authenticated, redirecting to ${redirectTo}`);
    return <Navigate to={redirectTo} replace />;
  }
  
  return children;
}

// Route Configuration
const publicRoutes = [
  { path: '/login', element: <LoginPage />, title: 'Login' },
  { path: '/register', element: <RegisterPage />, title: 'Register' },
];

const protectedRoutes = [
  { path: '/mytask', element: <MyTask />, title: 'My Tasks', description: 'Personal task management' },
  { path: '/profile', element: <ProfilePage />, title: 'Profile', description: 'User profile settings' },
];

const adminRoutes = [
  { path: '/dashboard', element: <DashBoard />, title: 'Admin Dashboard', description: 'Administrative overview' },
  { path: '/tasks', element: <TaskPage />, title: 'Task Management', description: 'Manage all tasks' },
  { path: '/users', element: <UserPage />, title: 'User Management', description: 'CRUD users & permissions' },
  { path: '/tickets', element: <TicketPage />, title: 'Ticket Management', description: 'Support ticket system' },
  { path: '/logwork', element: <LogWorkPage />, title: 'Work Logs', description: 'Time tracking & logs' },
];

// Main App Routes Component
function AppRoutes() {
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Enhanced authentication check on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Initializing authentication...');
      
      try {
        await checkAuth();
        console.log('✅ Authentication check completed');
      } catch (error) {
        console.error('❌ Authentication check failed:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeAuth();
  }, [checkAuth]);
  
  // Show loading spinner during initialization
  if (isInitializing) {
    return <LoadingSpinner />;
  }
  
  return (
    <Routes>
      {/* Root redirect based on role */}
      <Route 
        path="/" 
        element={
          <RootRedirect />
        } 
      />
      
      {/* Public routes với AuthLayout */}
      <Route element={<AuthLayout />}>
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<PublicRoute>{route.element}</PublicRoute>}
          />
        ))}
      </Route>
      
      {/* Protected routes với MainLayout */}
      <Route element={<MainLayout />}>
        {/* User routes */}
        {protectedRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<ProtectedRoute>{route.element}</ProtectedRoute>}
          />
        ))}
        
        {/* Admin routes */}
        {adminRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<AdminRoute>{route.element}</AdminRoute>}
          />
        ))}
      </Route>
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// Root Redirect Component
function RootRedirect() {
  const user = useAuthStore((state) => state.user);
  
  console.log('🏠 Root redirect check:', { 
    user: user?.email, 
    role: user?.role,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin()
  });
  
  if (!user || !isAuthenticated()) {
    console.log('🔄 No auth, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  const redirectTo = isAdmin() ? '/dashboard' : '/mytask';
  console.log(`🎯 Redirecting authenticated user to: ${redirectTo}`);
  
  return <Navigate to={redirectTo} replace />;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">Please refresh the page or contact support.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Component
function App() {
  useEffect(() => {
    console.log('🚀 App initialized');
    
    // Log available routes for debugging
    console.log('📋 Available routes:');
    console.log('  Public routes:', publicRoutes.map(r => r.path));
    console.log('  Protected routes:', protectedRoutes.map(r => r.path));
    console.log('  Admin routes:', adminRoutes.map(r => r.path));
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AppRoutes />
        <Toaster />
      </Router>
    </ErrorBoundary>
  );
}

export default App;

// 📁 FE: src/App.tsx
import type { JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

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

// Store
import { useAuthStore } from './store/authStore';

// Protected Route Components
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  
  if (!user) {
    // Lưu location hiện tại để redirect sau khi login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

function AdminRoute({ children }: { children: JSX.Element }) {
  const user = useAuthStore((state) => state.user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/mytask" replace />;
  }
  
  return children;
}

function PublicRoute({ children }: { children: JSX.Element }) {
  const user = useAuthStore((state) => state.user);
  
  // Nếu đã đăng nhập, redirect về trang phù hợp với role
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/dashboard' : '/mytask'} replace />;
  }
  
  return children;
}

// Route Configuration
const publicRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
];

const protectedRoutes = [
  { path: '/mytask', element: <MyTask /> },
  { path: '/profile', element: <ProfilePage /> },
];

const adminRoutes = [
  { path: '/dashboard', element: <DashBoard /> },
  { path: '/tasks', element: <TaskPage /> },
  { path: '/users', element: <UserPage /> },
  { path: '/tickets', element: <TicketPage /> },
  { path: '/logwork', element: <LogWorkPage /> },
];

function AppRoutes() {
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  
  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return (
    <Routes>
      {/* Root redirect based on role */}
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to={user.role === 'admin' ? '/dashboard' : '/mytask'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
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

function App() {
  return (
    <Router>
      <AppRoutes />
      <Toaster />
    </Router>
  );
}

export default App;
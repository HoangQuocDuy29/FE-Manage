// 📁 FE: src/App.tsx
import type { JSX } from 'react'; // Fix lỗi JSX.Element
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TaskPage from '@/pages/TaskPage'; // Trang TaskPage
import NotFoundPage from '@/pages/NotFoundPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import MyTask from '@/pages/MyTask'; // Trang công việc cho User
import { useAuthStore } from '@/store/authStore';
import { Toaster } from '@/components/ui/toaster';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = useAuthStore((state) => state.user);
  return user ? children : <Navigate to="/login" />; // Nếu người dùng không có, chuyển đến login
}

function ProtectedAdminRoute({ children }: { children: JSX.Element }) {
  const user = useAuthStore((state) => state.user);
  return user && user.role === 'admin' ? children : <Navigate to="/mytask" />; // Kiểm tra role là admin
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
          Task Manager
        </h1>

        <Routes>
          {/* Trang chính, bảo vệ và phân quyền theo vai trò */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TaskPage />
              </ProtectedRoute>
            }
          />
          
          {/* Route cho Admin, chỉ cho phép Admin vào trang Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedAdminRoute>
                <TaskPage />
              </ProtectedAdminRoute>
            }
          />

          {/* Trang công việc cho User */}
          <Route
            path="/mytask"
            element={
              <ProtectedRoute>
                <MyTask />
              </ProtectedRoute>
            }
          />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Route không tồn tại */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Hiển thị thông báo toast toàn cục */}
        <Toaster />
      </div>
    </Router>
  );
}

export default App;

import type { JSX } from 'react'; // fix lỗi JSX.Element
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import { useAuthStore } from '@/store/authStore';
import { Toaster } from '@/components/ui/toaster';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = useAuthStore((state) => state.user);
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
          Task Manager
        </h1>

        <Routes>
          {/* ✅ Trang chính (được bảo vệ) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* 🔐 Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ❌ Route không tồn tại */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* ✅ Hiển thị toast global */}
        <Toaster />
      </div>
    </Router>
  );
}

export default App;

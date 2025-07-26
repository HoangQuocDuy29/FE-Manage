import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import type { ReactElement } from "react";


// ✅ Middleware: Kiểm tra đăng nhập
const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔐 Route được bảo vệ */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100 p-6">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
                  Task Manager App
                </h1>
                <HomePage />
              </div>
            </ProtectedRoute>
          }
        />

        {/* 🌐 Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;

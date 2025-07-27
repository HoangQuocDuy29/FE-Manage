import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
        Task Manager
      </h1>

      <Routes>
        {/* ✅ Route chính */}
        <Route path="/" element={<HomePage />} />

        {/* ❌ Route không tồn tại → Trang 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;

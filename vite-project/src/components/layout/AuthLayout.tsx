// 📁 FE: src/components/layout/AuthLayout.tsx
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Task Manager</h1>
          <p className="text-gray-600">Quản lý công việc hiệu quả</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
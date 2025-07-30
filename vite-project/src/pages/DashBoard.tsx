// File: src/pages/DashBoard.tsx (MỚI - Dashboard với sidebar)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  ClipboardList, 
  Ticket, 
  Clock,
  Menu,
  X
} from 'lucide-react';

// Import các page components
import UserPage from    '../pages/UserPage';
import TaskPage from    '../pages/TaskPage';
import TicketPage from  '../pages/TicketPage';
import LogWorkPage from '../pages/LogWorkPage';


type ActivePage = 'users' | 'tasks' | 'tickets' | 'logwork';

export default function DashBoard() {
  const [activePage, setActivePage] = useState<ActivePage>('tasks');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    // Chỉ admin mới được vào dashboard
    if (user && user.role !== 'admin') {
      navigate('/mytask');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const menuItems = [
    {
      id: 'users' as ActivePage,
      label: 'User Management',
      icon: Users,
      description: 'CRUD users'
    },
    {
      id: 'tasks' as ActivePage,
      label: 'Task Management', 
      icon: ClipboardList,
      description: 'CRUD tasks với multiple assignees'
    },
    {
      id: 'tickets' as ActivePage,
      label: 'Ticket Management',
      icon: Ticket,
      description: 'Quản lý ticket cấp phép'
    },
    {
      id: 'logwork' as ActivePage,
      label: 'Log Work',
      icon: Clock,
      description: 'Hiển thị tiêu đề task'
    }
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'users':
        return <UserPage />;
      case 'tasks':
        return <TaskPage />;
      case 'tickets':
        return <TicketPage />;
      case 'logwork':
        return <LogWorkPage />;
      default:
        return <TaskPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'w-64' : 'w-16'
      } bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                {sidebarOpen && (
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{item.label}</span>
                    <span className={`text-xs ${
                      isActive ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {item.description}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-sm text-gray-600">Logged in as:</p>
              <p className="font-medium text-gray-800 truncate">{user.email}</p>
              <p className="text-xs text-blue-600 uppercase">{user.role}</p>
            </div>
          )}
          <Button
            variant="destructive"
            size={sidebarOpen ? "default" : "icon"}
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full"
          >
            {sidebarOpen ? 'Đăng xuất' : '🚪'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {menuItems.find(item => item.id === activePage)?.label}
              </h2>
              <p className="text-sm text-gray-600">
                {menuItems.find(item => item.id === activePage)?.description}
              </p>
            </div>
            
            {/* Breadcrumb hoặc Actions có thể thêm ở đây */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
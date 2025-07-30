// File: src/pages/DashBoard.tsx (UPDATED - Admin access improvements)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  ClipboardList, 
  Ticket, 
  Clock,
  Menu,
  X,
  Shield,
  Home,
  Settings,
  Bell
} from 'lucide-react';

// Import các page components
import UserPage from '../pages/UserPage';
import TaskPage from '../pages/TaskPage';
import TicketPage from '../pages/TicketPage';
import LogWorkPage from '../pages/LogWorkPage';

type ActivePage = 'users' | 'tasks' | 'tickets' | 'logwork' | 'dashboard';

export default function DashBoard() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  // Enhanced authentication check
  useEffect(() => {
    const checkAuth = () => {
      console.log('🔐 Dashboard auth check:', { user, role: user?.role });
      
      // Nếu không có user, redirect về login
      if (!user) {
        console.log('❌ No user found, redirecting to login');
        navigate('/login');
        return;
      }

      // Kiểm tra multiple admin conditions để đảm bảo access
      const isAdminUser = user.role === 'admin' || 
                         user.roleName === 'admin' || 
                         user.isAdmin === true;

      console.log('🔐 Admin check:', {
        role: user.role,
        roleName: user.roleName,
        isAdmin: user.isAdmin,
        finalResult: isAdminUser
      });

      // Nếu không phải admin, redirect về mytask
      if (!isAdminUser) {
        console.log('⚠️ User is not admin, redirecting to /mytask');
        navigate('/mytask');
        return;
      }

      console.log('✅ Admin access granted to dashboard');
      setLoading(false);
    };

    checkAuth();
  }, [user, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Admin check với error message
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Authentication required. Redirecting to login...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isAdminUser = user.role === 'admin' || 
                     user.roleName === 'admin' || 
                     user.isAdmin === true;

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Admin access required. Redirecting...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const menuItems = [
    {
      id: 'dashboard' as ActivePage,
      label: 'Dashboard',
      icon: Home,
      description: 'Overview & Statistics'
    },
    {
      id: 'users' as ActivePage,
      label: 'User Management',
      icon: Users,
      description: 'CRUD users & permissions'
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
      description: 'Hiển thị tiêu đề task & time tracking'
    }
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'users':
        return <UserPage />;
      case 'tasks':
        return <TaskPage />;
      case 'tickets':
        return <TicketPage />;
      case 'logwork':
        return <LogWorkPage />;
      default:
        return <DashboardOverview />;
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
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-xs text-gray-500">Full Access Dashboard</p>
            </div>
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
                onClick={() => {
                  console.log(`📍 Navigating to: ${item.id}`);
                  setActivePage(item.id);
                }}
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
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-blue-600 font-medium">ADMIN ACCESS</span>
              </div>
              <p className="text-sm text-gray-600">Logged in as:</p>
              <p className="font-medium text-gray-800 truncate">{user.fullName || user.email}</p>
              <p className="text-xs text-blue-600 uppercase">{user.role}</p>
            </div>
          )}
          <Button
            variant="destructive"
            size={sidebarOpen ? "default" : "icon"}
            onClick={() => {
              console.log('🚪 Admin logout');
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
            
            {/* Admin Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-700 font-medium">Admin Mode</span>
              </div>
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

// Dashboard Overview Component
function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold">User Management</h3>
              <p className="text-sm text-gray-600">Manage users, roles & permissions</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center gap-4">
            <ClipboardList className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Task Management</h3>
              <p className="text-sm text-gray-600">Create, assign & track tasks</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center gap-4">
            <Ticket className="w-8 h-8 text-purple-500" />
            <div>
              <h3 className="text-lg font-semibold">Ticket System</h3>
              <p className="text-sm text-gray-600">Handle support tickets</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-orange-500" />
            <div>
              <h3 className="text-lg font-semibold">Time Tracking</h3>
              <p className="text-sm text-gray-600">Monitor work logs & productivity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold mb-4">Admin Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Add New User
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Create Task
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            System Settings
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">Admin Access Confirmed</h3>
        </div>
        <p className="text-blue-700">
          You have full administrative access to all dashboard features. 
          Navigate freely between all management sections using the sidebar menu.
        </p>
      </div>
    </div>
  );
}

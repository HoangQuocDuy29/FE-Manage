// File: src/pages/TaskPage.tsx (CẬP NHẬT - tương thích với User APIs)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { fetchTasks, searchTasks, fetchUsersForDropdown } from '@/services/api'; // ← THÊM fetchUsersForDropdown
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import FilterDropdown from '@/components/FilterDropdown';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, RefreshCw } from 'lucide-react'; // ← THÊM RefreshCw
import { useToast } from '@/components/hooks/use-toast'; // ← THÊM toast

export default function TaskPage() {
  const setTasks = useTaskStore((state) => state.setTasks);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { toast } = useToast(); // ← THÊM toast

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<Array<{id: number, name: string, email: string}>>([]); // ← THÊM state cho users

  const [filters, setFilters] = useState({
    assignee: '',
    priority: '',
    deadline: '',
  });

  const loadAllTasks = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.assignee) query.append('assignee', filters.assignee);
      if (filters.priority) query.append('priority', filters.priority);
      if (filters.deadline) query.append('deadline', filters.deadline);

      const response = await fetchTasks(query.toString());
      setTasks(response.data);
      setIsSearching(false);
    } catch (error) {
      console.error('Lỗi khi tải danh sách công việc:', error);
      // ← THÊM toast error
      toast({
        title: 'Error loading tasks',
        description: 'Could not load tasks. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // ← THÊM function load users từ API
  const loadUsers = async () => {
    try {
      const users = await fetchUsersForDropdown();
      setAvailableUsers(users);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login'); // 🔐 Nếu chưa đăng nhập → chuyển về login
    }
  }, [user]);

  useEffect(() => {
    loadAllTasks();
    loadUsers(); // ← THÊM load users
  }, [filters]);

  const handleSearch = async () => {
    const keyword = searchTerm.trim();
    if (!keyword) return;

    setLoading(true);
    try {
      const response = await searchTasks(keyword);
      setTasks(response.data);
      setIsSearching(true);
      // ← THÊM toast success
      toast({
        title: 'Search completed',
        description: `Found ${response.data.length} tasks matching "${keyword}"`
      });
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
      setTasks([]);
      // ← THÊM toast error
      toast({
        title: 'Search failed',
        description: 'Could not search tasks. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setIsSearching(false); // ← FIX: set isSearching = false
    loadAllTasks();
  };

  // ← THÊM function refresh
  const handleRefresh = () => {
    loadAllTasks();
    loadUsers();
    toast({
      title: 'Tasks refreshed',
      description: 'Task list has been updated'
    });
  };

  if (!user) return null;

  // ← CHUYỂN users thành array tên cho FilterDropdown
  const assigneeNames = availableUsers.map(user => user.name);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* ✅ Top Header: Email + Đăng xuất */}
      <div className="flex justify-end items-center mb-4">
        <span className="text-gray-700 font-medium mr-4">{user.email}</span>
        <span className="text-sm text-blue-600 uppercase mr-4">{user.role}</span> {/* ← THÊM role display */}
        <Button
          variant="destructive"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Đăng xuất
        </Button>
      </div>

      {/* ✅ Toolbar: Create + Search + Filter + Refresh */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4"> {/* ← THÊM background */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Create */}
            <Button
              onClick={() => setShowForm(!showForm)}
              variant={showForm ? "secondary" : "default"} // ← THÊM variant
              className="flex items-center gap-2"
            >
              {showForm ? 'Close Form' : 'Create Task'}
            </Button>

            {/* ← THÊM Refresh button */}
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            {/* Search bar */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by ID or Assignee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // ← THÊM Enter key
              />
              <Button onClick={handleSearch} className="p-2" disabled={loading || !searchTerm.trim()}> {/* ← THÊM disable logic */}
                <Search className="w-4 h-4" />
              </Button>
              {isSearching && (
                <Button variant="ghost" onClick={handleClear} className="p-2">
                  <X className="w-4 h-4 text-gray-600" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Filters</h3> {/* ← THÊM label */}
          <FilterDropdown
            filters={filters}
            setFilters={setFilters}
            assignees={assigneeNames} // ← SỬ DỤNG real users thay vì hardcode
          />
        </div>

        {/* ← THÊM Active filters indicator */}
        {(filters.assignee || filters.priority || filters.deadline || isSearching) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">Active filters:</span>
            
            {isSearching && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
              </span>
            )}
            
            {filters.assignee && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Assignee: {filters.assignee}
              </span>
            )}
            
            {filters.priority && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                Priority: {filters.priority}
              </span>
            )}
            
            {filters.deadline && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Deadline: {new Date(filters.deadline).toLocaleDateString()}
              </span>
            )}
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setFilters({ assignee: '', priority: '', deadline: '' });
                handleClear();
              }}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Task Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow"> {/* ← THÊM styling */}
          <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Task</h2>
          <TaskForm
            onSuccess={() => {
              setShowForm(false);
              loadAllTasks();
              // ← THÊM toast
              toast({
                title: 'Task created successfully',
                description: 'The new task has been added to the list'
              });
            }}
          />
        </div>
      )}

      {/* Task List */}
      <div className="bg-white rounded-lg shadow"> {/* ← THÊM styling */}
        {loading ? (
          <div className="p-8 text-center"> {/* ← IMPROVE loading UI */}
            <div className="inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-gray-500">Loading tasks...</span>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {isSearching ? 'Search Results' : 'All Tasks'}
              </h2>
              {isSearching && (
                <Button variant="outline" size="sm" onClick={handleClear}>
                  Show All Tasks
                </Button>
              )}
            </div>
            <TaskList />
          </div>
        )}
      </div>

      {/* ← THÊM Available Users Info */}
      {availableUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Available Assignees ({availableUsers.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableUsers.slice(0, 10).map((user) => (
              <span 
                key={user.id}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-white text-blue-700 border border-blue-200"
              >
                {user.name}
              </span>
            ))}
            {availableUsers.length > 10 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs text-blue-600">
                +{availableUsers.length - 10} more...
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
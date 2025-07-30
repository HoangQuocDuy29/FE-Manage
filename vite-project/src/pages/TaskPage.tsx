// 📁 FE: src/pages/HomePage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { fetchTasks, searchTasks } from '@/services/api';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import FilterDropdown from '@/components/FilterDropdown';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

export default function HomePage() {
  const setTasks = useTaskStore((state) => state.setTasks);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login'); // 🔐 Nếu chưa đăng nhập → chuyển về login
    }
  }, [user]);

  useEffect(() => {
    loadAllTasks();
  }, [filters]);

  const handleSearch = async () => {
    const keyword = searchTerm.trim();
    if (!keyword) return;

    setLoading(true);
    try {
      const response = await searchTasks(keyword);
      setTasks(response.data);
      setIsSearching(true);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    loadAllTasks();
  };

  if (!user) return null;

  return (
  <div className="p-6 max-w-6xl mx-auto space-y-6">
    {/* ✅ Top Header: Email + Đăng xuất */}
    <div className="flex justify-end items-center mb-4">
      <span className="text-gray-700 font-medium mr-4">{user.email}</span>
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

    {/* ✅ Toolbar: Create + Search + Filter */}
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* Create */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-100 border border-red-500 text-red-600 font-semibold px-4 py-2 rounded"
        >
          {showForm ? 'Close' : 'Create'}
        </button>

        {/* Search bar */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by ID or Assignee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleSearch} className="p-2" disabled={loading}>
            <Search className="w-4 h-4" />
          </Button>
          {isSearching && (
            <Button variant="ghost" onClick={handleClear} className="p-2">
              <X className="w-4 h-4 text-gray-600" />
            </Button>
          )}
        </div>

        {/* Filter */}
        <FilterDropdown
          filters={filters}
          setFilters={setFilters}
          assignees={['John Doe', 'Jane Smith', 'Alice Cooper']}
        />
      </div>
    </div>

    {/* Task Form */}
    {showForm && (
      <TaskForm
        onSuccess={() => {
          setShowForm(false);
          loadAllTasks();
        }}
      />
    )}

    {/* Task List */}
    {loading ? (
      <p className="text-gray-500">Loading...</p>
    ) : (
      <TaskList />
    )}
  </div>
);

}

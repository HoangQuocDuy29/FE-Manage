import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { fetchTasks, searchTasks } from "@/services/api";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import FilterDropdown from "@/components/FilterDropdown"; // Import FilterDropdown
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import api from "@/lib/axios";

export default function HomePage() {
  const setTasks = useTaskStore((state) => state.setTasks);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  // State lưu trữ giá trị lọc
  const [filters, setFilters] = useState({
    assignee: "",   // Filter assignee (ban đầu rỗng)
    priority: "",   // Filter priority (ban đầu rỗng)
    deadline: "",   // Filter deadline (ban đầu rỗng)
  });

  const loadAllTasks = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();

      // Thêm filter nếu có
      if (filters.assignee) query.append("assignee", filters.assignee);
      if (filters.priority) query.append("priority", filters.priority);
      if (filters.deadline) query.append("deadline", filters.deadline);

      const response = await fetchTasks(query.toString());
      setTasks(response.data);
      setIsSearching(false);
    } catch (error) {
      console.error("Lỗi khi tải danh sách công việc:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllTasks();
  }, [filters]); // Chạy lại khi filters thay đổi

  const handleSearch = async () => {
    const keyword = searchTerm.trim();

    // Nếu keyword trống hoặc toàn khoảng trắng, thì không gọi API
    if (!keyword || keyword.length === 0) {
      console.warn("⛔ Không tìm kiếm với chuỗi rỗng");
      return;
    }

    setLoading(true);
    try {
      const response = await searchTasks(keyword);
      setTasks(response.data);
      setIsSearching(true);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    loadAllTasks(); // gọi lại danh sách mặc định (theo filters)
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header: Create + Search + Filter */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-100 border border-red-500 text-red-600 font-semibold px-4 py-2 rounded"
        >
          {showForm ? "Close" : "Create"}
        </button>

        {/* Search bar */}
        <div className="flex items-center gap-2 flex-1">
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

        {/* Filter Dropdown */}
        <FilterDropdown filters={filters} setFilters={setFilters} assignees={["John Doe", "Jane Smith", "Alice Cooper"]} />
      </div>

      {/* Form thêm công việc */}
      {showForm && (
        <TaskForm
          onSuccess={() => {
            setShowForm(false);
            loadAllTasks();
          }}
        />
      )}

      {/* Danh sách công việc */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <TaskList />
      )}
    </div>
  );
}

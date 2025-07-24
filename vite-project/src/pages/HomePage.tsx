import { useEffect } from "react";
import { useTaskStore } from "@/store/taskStore";
import { fetchTasks } from "@/services/api";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import SearchBar from "@/components/ui/SearchBar";
import CreateButton from "@/components/ui/CreateButton";
import FilterCheckbox from "@/components/ui/FilterCheckbox";

export default function HomePage() {
  const setTasks = useTaskStore((state) => state.setTasks);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetchTasks();
        setTasks(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách công việc:", error);
      }
    };
    loadTasks();
  }, [setTasks]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header controls: Create + Search + Checkbox filter */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <CreateButton />

        <div className="flex-1">
          <SearchBar />
        </div>

        <FilterCheckbox />
      </div>

      {/* Form tạo công việc */}
      <TaskForm />

      

      {/* Danh sách công việc */}
      <TaskList />
    </div>
  );
}

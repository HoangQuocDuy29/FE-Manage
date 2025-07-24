import { create } from "zustand";
import type { Task as TaskSchemaType } from "@/schemas/task.schema";

// ✅ Kiểu Task đầy đủ, mở rộng từ schema và thêm các metadata
export type Task = TaskSchemaType & {
  id: number;
  createdAt: string;
  updatedAt: string;
};

// ✅ Định nghĩa shape của Zustand store
export type TaskStore = {
  tasks: Task[];                    // Danh sách task hiện tại
  searchQuery: string;             // Query đang search

  // ✅ Các actions thao tác store
  setSearchQuery: (query: string) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
};

// ✅ Khởi tạo Zustand store
export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  searchQuery: "",

  // ✅ Cập nhật query khi search
  setSearchQuery: (query) => set({ searchQuery: query }),

  // ✅ Thay thế toàn bộ danh sách task
  setTasks: (tasks) => set({ tasks }),

  // ✅ Thêm 1 task mới vào đầu danh sách
  addTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks] })),

  // ✅ Cập nhật 1 task theo ID
  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === updatedTask.id ? updatedTask : t
      ),
    })),

  // ✅ Xoá task theo ID
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
}));

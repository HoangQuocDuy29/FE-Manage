import { toast } from "@/components/hooks/use-toast";
import { useTaskStore } from "@/store/taskStore";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Task = {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  priority: "low" | "medium" | "high";
  assignee: string;
  createdAt?: string;
};


export default function TaskList() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showReadModal, setShowReadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const tasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadAllTasks = async () => {
    try {
      const response = await axios.get("/api/tasks");
      setTasks(response.data);
    } catch (err) {
      console.error("Lỗi khi loadAllTasks", err);
    }
  };



  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      await axios.put(`/api/tasks/${editingTask.id}`, editingTask);
      await loadAllTasks();
      setEditingTask(null);
      toast({
        title: "✅ Cập nhật thành công",
        description: `Task "${editingTask.title}" đã được cập nhật.`,
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật task:", err);
      toast({
        variant: "destructive",
        title: "❌ Cập nhật thất bại",
        description: "Vui lòng thử lại sau.",
      });
    }
  };

  if (tasks.length === 0)
    return <p className="text-gray-500 italic">Chưa có công việc nào.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Priority</th>
            <th className="border px-4 py-2">Assignee</th>
            <th className="border px-4 py-2">Option</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="text-center hover:bg-gray-50">
              <td className="border px-4 py-2">{task.title}</td>
              <td className="border px-4 py-2">{task.priority}</td>
              <td className="border px-4 py-2">{task.assignee}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={async () => {
                    try {
                      const res = await axios.get(`/api/tasks/${task.id}`);
                      setSelectedTask(res.data);
                      setShowReadModal(true);
                    } catch (err) {
                      console.error("Lỗi khi đọc task:", err);
                    }
                  }}
                  className="bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded"
                >
                  Details
                </button>

                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setShowDeleteModal(true);
                  }}
                  className="bg-orange-100 hover:bg-orange-200 px-2 py-1 rounded"
                >
                  Delete
                </button>

                <button
                  onClick={() => setEditingTask(task)}
                  className="bg-green-100 hover:bg-green-200 px-2 py-1 rounded"
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form Cập Nhật */}
      {editingTask && (
        <form
          onSubmit={handleUpdateSubmit}
          className="mt-6 p-4 border bg-white shadow rounded"
        >
          <h2 className="text-lg font-semibold mb-2">📝 Update Task</h2>
          <input
            className="border p-2 mb-2 w-full"
            value={editingTask.title}
            onChange={(e) =>
              setEditingTask({ ...editingTask, title: e.target.value })
            }
            placeholder="Tiêu đề"
          />
          <input
            className="border p-2 mb-2 w-full"
            value={editingTask.assignee}
            onChange={(e) =>
              setEditingTask({ ...editingTask, assignee: e.target.value })
            }
            placeholder="Người nhận"
          />
          <label htmlFor="priority-select" className="block mb-1 font-medium">
            Priority
          </label>
          <select
            id="priority-select"
            className="border p-2 mb-2 w-full"
            value={editingTask.priority}
            onChange={(e) =>
              setEditingTask({
                ...editingTask,
                priority: e.target.value as Task["priority"],
              })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingTask(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ✅ Modal READ chi tiết task */}
      <Dialog open={showReadModal} onOpenChange={setShowReadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>📄 Chi tiết công việc</DialogTitle>
              <DialogDescription>
                {selectedTask ? (
                  <div className="space-y-2 mt-2 text-sm text-gray-700">
                    <p>
                      <strong className="text-gray-900">Tiêu đề:</strong> {selectedTask.title}
                    </p>
                    {selectedTask.description && (
                      <p>
                        <strong className="text-gray-900">Mô tả:</strong> {selectedTask.description}
                      </p>
                    )}
                    <p>
                      <strong className="text-gray-900">Người nhận:</strong> {selectedTask.assignee}
                    </p>
                    <p>
                      <strong className="text-gray-900">Ưu tiên:</strong> {selectedTask.priority}
                    </p>
                    {selectedTask.deadline && (
                      <p>
                        <strong className="text-gray-900">Hạn chót:</strong>{" "}
                        {new Date(selectedTask.deadline).toLocaleString("vi-VN")}
                      </p>
                    )}
                    {selectedTask.createdAt && (
                      <p>
                        <strong className="text-gray-900">Ngày tạo:</strong>{" "}
                        {new Date(selectedTask.createdAt).toLocaleString("vi-VN")}
                      </p>
                    )}
                  </div>
                ) : (
                  <p>Đang tải...</p>
                )}
              </DialogDescription>

          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* ✅ Modal DELETE xác nhận xoá */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xoá</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xoá công việc:{" "}
              <strong>{selectedTask?.title}</strong> không?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={async () => {
                if (!selectedTask) return;
                try {
                  await axios.delete(`/api/tasks/${selectedTask.id}`);
                  await loadAllTasks();
                  setShowDeleteModal(false);
                  toast({
                    title: "🗑 Đã xoá công việc",
                    description: `Công việc "${selectedTask.title}" đã được xoá.`,
                  });
                } catch (err) {
                  console.error("Lỗi khi xoá task:", err);
                  toast({
                    variant: "destructive",
                    title: "❌ Xoá thất bại",
                    description: "Không thể xoá task. Vui lòng thử lại.",
                  });
                }
              }}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Xoá
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Huỷ
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

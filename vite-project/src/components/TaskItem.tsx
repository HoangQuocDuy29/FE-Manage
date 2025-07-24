import type { Task } from "@/store/taskStore";
import { Badge } from "@/components/ui/badge";

export default function TaskItem({ task }: { task: Task }) {
  const statusColor = {
    pending: "bg-gray-200 text-gray-800",
    in_progress: "bg-yellow-200 text-yellow-800",
    done: "bg-green-200 text-green-800",
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{task.title}</h3>
        <Badge className={statusColor[task.status]}>
          {task.status === "pending"
            ? "Chưa làm"
            : task.status === "in_progress"
            ? "Đang làm"
            : "Hoàn thành"}
        </Badge>
      </div>
      {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
    </div>
  );
}

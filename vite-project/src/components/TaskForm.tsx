import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskStore } from "@/store/taskStore";
import axios from "axios";
import { useState } from "react";

// ✅ Định nghĩa prop type
type Props = {
  onSuccess?: () => void;
};

// ✅ Schema không có status
const taskSchema = z.object({
  title: z.string().min(3, "Tiêu đề phải có ít nhất 3 ký tự"),
  description: z.string().min(3, "Mô tả phải có ít nhất 3 ký tự"),
  assignee: z.string().min(3, "Assignee phải có ít nhất 3 ký tự"),
  priority: z.enum(["low", "medium", "high"]),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Vui lòng chọn ngày hợp lệ",
  }),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function TaskForm({ onSuccess }: Props) {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      assignee: "",
      priority: "low",
      deadline: "",
    },
  });

  const addTask = useTaskStore((state) => state.addTask);

  const onSubmit = async (data: TaskFormData) => {
    try {
      const isoDeadline = new Date(data.deadline + "T00:00:00Z").toISOString();

      const payload = {
        ...data,
        deadline: isoDeadline,
        createdAt: new Date().toISOString(),
      };

      const response = await axios.post("http://localhost:3000/api/tasks", payload);
      addTask(response.data);
      reset();
      setMessage("Thêm công việc thành công!");

      // ✅ Gọi callback nếu có
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating task", error);
      setMessage("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
      <div>
        <Input placeholder="Tiêu đề công việc" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Textarea placeholder="Mô tả" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Input placeholder="Assignee" {...register("assignee")} />
        {errors.assignee && (
          <p className="text-sm text-red-500 mt-1">{errors.assignee.message}</p>
        )}
      </div>

      <div>
        <Select onValueChange={(value) => setValue("priority", value as TaskFormData["priority"])}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        {errors.priority && (
          <p className="text-sm text-red-500 mt-1">{errors.priority.message}</p>
        )}
      </div>

      <div>
        <Input type="date" {...register("deadline")} />
        {errors.deadline && (
          <p className="text-sm text-red-500 mt-1">{errors.deadline.message}</p>
        )}
      </div>

      <Button type="submit">Add Task</Button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </form>
  );
}

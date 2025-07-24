import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTaskStore } from "@/store/taskStore";
import axios from "axios";
import { useState } from "react";

// Định nghĩa schema với Zod, tất cả các trường đều yêu cầu nhập
const taskSchema = z.object({
  title: z.string().min(3, "Tiêu đề phải có ít nhất 3 ký tự"), // Tiêu đề bắt buộc
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"), // Mô tả bắt buộc
  assignee: z.string().min(3, "Assignee phải có ít nhất 3 ký tự"), // Assignee bắt buộc
  priority: z.enum(["low", "medium", "high"]), // Priority bắt buộc
  status: z.enum(["pending", "in_progress", "done"]), // Trạng thái bắt buộc
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function TaskForm() {
  const [message, setMessage] = useState(""); // Thông báo thành công hoặc lỗi
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      assignee: "",
      priority: "low",
      status: "pending",
    },
  });

  const addTask = useTaskStore((state) => state.addTask);

  const onSubmit = async (data: TaskFormData) => {
    try {
      // Gửi dữ liệu lên backend
      const response = await axios.post("http://localhost:3000/api/tasks", data);

      // Thêm task vào Zustand
      addTask(response.data);
      reset(); // Reset form sau khi thành công
      setMessage("Thêm công việc thành công!"); // Hiển thị thông báo thành công
    } catch (error) {
      console.error("Error creating task", error);
      setMessage("Có lỗi xảy ra. Vui lòng thử lại!"); // Thông báo lỗi
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
      <div>
        <Input placeholder="Tiêu đề công việc" {...register("title")} />
        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <Textarea placeholder="Mô tả (tuỳ chọn)" {...register("description")} />
        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <Input placeholder="Assignee" {...register("assignee")} />
        {errors.assignee && <p className="text-sm text-red-500 mt-1">{errors.assignee.message}</p>}
      </div>

      <div>
        <Select onValueChange={(value) => setValue("priority", value as TaskFormData["priority"])} >
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        {errors.priority && <p className="text-sm text-red-500 mt-1">{errors.priority.message}</p>}
      </div>

      <div>
        <Select onValueChange={(value) => setValue("status", value as TaskFormData["status"])} >
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Chưa làm</SelectItem>
            <SelectItem value="in_progress">Đang làm</SelectItem>
            <SelectItem value="done">Hoàn thành</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
      </div>

      <Button type="submit">Thêm công việc</Button>

      {/* Hiển thị thông báo */}
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </form>
  );
}

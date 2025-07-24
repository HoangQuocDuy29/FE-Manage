import { z } from 'zod';

export const TaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  deadline: z.string().datetime(),
  priority: z.enum(['low', 'medium', 'high']),
  assignee: z.string().min(1),
  status: z.enum(['pending', 'in_progress', 'done'])
});

export type TaskInput = z.infer<typeof TaskSchema>;

// Đây là kiểu dữ liệu của 1 task đầy đủ (đã có id, dùng cho danh sách hiển thị)
export type Task = TaskInput & {
  id: string;
};

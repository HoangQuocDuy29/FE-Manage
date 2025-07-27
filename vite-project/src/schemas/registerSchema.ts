// FE: src/schemas/registerSchema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
  password: z.string().min(6, { message: 'Mật khẩu tối thiểu 6 ký tự' }),
});

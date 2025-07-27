// 📁 FE: src/pages/RegisterPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/registerSchema';
import { z } from 'zod';
import { register as registerUser } from '../services/auth';
import { useToast } from '../components/hooks/use-toast';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const { toast } = useToast();
  const navigate = useNavigate(); // ✅ để chuyển hướng

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data);
      toast({ title: 'Đăng ký thành công. Vui lòng đăng nhập.' });
      navigate('/login'); // ✅ chuyển đến trang login
    } catch (err: any) {
      toast({
        title: 'Đăng ký thất bại',
        description: err?.response?.data?.error || 'Lỗi không xác định',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input {...register('email')} placeholder="Email" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Input type="password" {...register('password')} placeholder="Mật khẩu" />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full">Đăng ký</Button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Đã có tài khoản?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline font-medium"
          >
            Đăng nhập
          </button>
        </p>

      </form>
    </div>
  );
}

// 📁 FE: src/pages/LoginPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas/loginSchema';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { login } from '@/services/auth';
import { setToken } from '@/utils/token';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const setUser = useAuthStore((s) => s.setUser);
  const { toast } = useToast();
  const navigate = useNavigate(); // ✅ dùng để chuyển route

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await login(data);
      setToken(res.token);
      setUser(res.user);
      toast({ title: 'Đăng nhập thành công' });
      navigate('/'); // ✅ chuyển về HomePage
    } catch (err: any) {
      toast({
        title: 'Đăng nhập thất bại',
        description: err?.response?.data?.error || 'Lỗi không xác định',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input {...register('email')} placeholder="Email" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Input type="password" {...register('password')} placeholder="Mật khẩu" />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full">Đăng nhập</Button>
        <p className="text-center text-sm mt-4">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-blue-600 hover:underline font-medium">
          Đăng ký
        </Link>
      </p>
      </form>
    </div>
  );
}

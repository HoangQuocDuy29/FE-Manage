import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const registerSchema = z.object({
  name: z.string().min(2, "Tên quá ngắn"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Gán baseURL nếu cần
  useEffect(() => {
    axios.defaults.baseURL = "http://localhost:3000";
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await axios.post("/api/auth/register", data);
      alert("🎉 Đăng ký thành công! Mời bạn đăng nhập.");
      navigate("/login");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Đăng ký thất bại";
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-teal-500">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Tên</label>
            <input
              type="text"
              {...register("name")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>
          <div>
            <label>Mật khẩu</label>
            <input
              type="password"
              {...register("password")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Đăng ký
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Đã có tài khoản?{" "}
          <a href="/login" className="text-green-600 hover:underline">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}

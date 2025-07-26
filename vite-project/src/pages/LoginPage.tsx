import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // ⚙️ Gán baseURL nếu cần
  useEffect(() => {
    axios.defaults.baseURL = "http://localhost:3000";
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await axios.post("/api/auth/login", data);
      const token = res.data.token;
      localStorage.setItem("token", token);

      // ✅ Set token vào header mặc định của axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-blue-500">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Đăng nhập
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Đăng ký
          </a>
        </p>
      </div>
    </div>
  );
}

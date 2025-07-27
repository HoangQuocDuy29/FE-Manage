import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 text-center px-6">
      <motion.h1
        className="text-[120px] font-extrabold text-red-500 drop-shadow-md"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: [0.7, 1.1, 1], opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        404
      </motion.h1>

      <motion.p
        className="text-2xl text-gray-700 font-medium"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        😵‍💫 Oops! Trang bạn tìm không tồn tại.
      </motion.p>

      <motion.button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.95 }}
      >
        ⬅️ Quay về trang chủ
      </motion.button>
    </div>
  );
};

export default NotFoundPage;

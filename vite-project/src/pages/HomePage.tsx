import { Link } from 'react-router-dom'; // Đảm bảo đã import Link để điều hướng

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1>Chào mừng đến với trang chủ!</h1>
      <nav>
        <Link to="/login">Đăng nhập</Link> | 
        <Link to="/register">Đăng ký</Link>
      </nav>
    </div>
  );
};

export default HomePage;

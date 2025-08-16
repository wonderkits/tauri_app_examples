import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', textAlign: 'center' }}>
      <h2>🚫 页面未找到</h2>
      <p>请检查URL路径</p>
      <div style={{ marginTop: '16px' }}>
        <Link to="/" style={{ color: '#10b981', textDecoration: 'none' }}>
          返回首页
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
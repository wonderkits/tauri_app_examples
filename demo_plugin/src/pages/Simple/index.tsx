import { getLayout } from '../../layouts';

const SimplePage = () => {
  // 使用简单布局
  const Layout = getLayout('simple');

  return (
    <Layout>
      <div>
        <h2>📝 简单页面</h2>
        <p>这个页面使用简单布局，有基础的边距和背景，但没有导航菜单。</p>
        <div style={{
          marginTop: '20px',
          padding: '16px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          background: '#f9f9f9'
        }}>
          <h3>特点：</h3>
          <ul>
            <li>浅色主题</li>
            <li>宽松的内边距</li>
            <li>最大宽度限制</li>
            <li>居中对齐</li>
            <li>没有导航栏</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};


export default SimplePage;
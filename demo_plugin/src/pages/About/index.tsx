import { useWujieIntegration } from '../../hooks/useWujieIntegration';
import { getLayout } from '../../layouts';

const AboutPage = () => {
  const { isInWujie } = useWujieIntegration();

  // 使用简单布局
  const Layout = getLayout('simple');

  return (
    <Layout>
      <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', marginBottom: '32px' }}>
        <h2>ℹ️ 关于页面</h2>
        <p>这是关于页面，演示子应用的路由切换。</p>
        <p>在Wujie环境中，路由状态会与主应用保持同步。</p>
      </div>
      
      {/* 底部提示 */}
      <div style={{ 
        textAlign: 'center', 
        fontSize: '14px',
        opacity: '0.8'
      }}>
        {isInWujie ? (
          <p>✨ 此应用运行在Wujie微前端环境中，与主应用完全隔离</p>
        ) : (
          <p>🚀 此应用当前独立运行，可被Wujie作为子应用加载</p>
        )}
      </div>
    </Layout>
  );
};


export default AboutPage;
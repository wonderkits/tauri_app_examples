import { getLayout } from '../../layouts';

const FullscreenPage = () => {
  // 使用全屏布局
  const Layout = getLayout('fullscreen');

  return (
    <Layout>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: '#fff',
        fontSize: '2rem'
      }}>
        <h1>🖥️ 全屏页面</h1>
        <p style={{ fontSize: '1rem', marginTop: '20px' }}>
          这个页面使用全屏布局，没有导航和边距
        </p>
      </div>
    </Layout>
  );
};


export default FullscreenPage;
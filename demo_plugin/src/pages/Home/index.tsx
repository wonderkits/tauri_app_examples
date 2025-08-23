import { StatusIndicator } from '../../components/StatusIndicator';
import { EnvironmentCards } from '../../components/EnvironmentCards';
import { useWujieIntegration } from '../../hooks/useWujieIntegration';

import { getLayout } from '../../layouts';
import { getWonderKitsClient } from '@wonderkits/client';

const HomePage = () => {
  const { isInWujie, parentProps } = useWujieIntegration();

  // 获取 Layout 组件
  const Layout = getLayout('default'); // 使用默认布局

  return (
    <Layout>
      <div
        style={{
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          marginBottom: '32px',
        }}
      >
        <h2>🏠 首页</h2>
        <p>这是子应用的首页，展示路由功能正常工作。</p>
        <p>当前路径会自动同步到主应用的URL中。</p>

        {/* WonderKits 客户端状态 */}
        <StatusIndicator
          connected={true}
          clientMode={getWonderKitsClient()?.getMode()}
          services={getWonderKitsClient()?.getInitializedServices() || []}
        />

        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          <button
            onClick={getWonderKitsClient().destroy}
            style={{
              background: '#ef4444',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            断开连接
          </button>
        </div>
      </div>

      {/* 环境信息和交互演示卡片 */}
      <EnvironmentCards isInWujie={isInWujie} parentProps={parentProps} />
    </Layout>
  );
};

export default HomePage;

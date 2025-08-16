import { CommunicationCards } from '../../components/CommunicationCards';
import { useWujieIntegration } from '../../hooks/useWujieIntegration';
import { getLayout } from '../../layouts';

const FeaturesPage = () => {
  const { isInWujie, parentProps, messages, sendMessageToParent } = useWujieIntegration();

  // 使用默认布局
  const Layout = getLayout('default');

  return (
    <Layout>
      <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', marginBottom: '32px' }}>
        <h2>⚡ 功能特性</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li>✅ 支持独立开发和运行</li>
          <li>✅ Wujie微前端无缝集成</li>
          <li>✅ 路由状态自动同步</li>
          <li>✅ 应用间通信</li>
          <li>✅ 生命周期管理</li>
          <li>✅ SQL 数据库功能</li>
          <li>✅ 文件系统功能 (新增)</li>
          <li>✅ 键值存储功能 (新增)</li>
          <li>✅ 环境自动检测切换</li>
        </ul>
      </div>
      
      <CommunicationCards
        isInWujie={isInWujie}
        parentProps={parentProps}
        messages={messages}
        onSendMessage={sendMessageToParent}
      />
    </Layout>
  );
};


export default FeaturesPage;
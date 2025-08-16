interface Props {
  connected: boolean;
  clientMode?: string;
  services?: string[];
}

export const StatusIndicator = ({ connected, clientMode, services = [] }: Props) => {
  return (
    <div style={{
      marginTop: '20px',
      padding: '16px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px'
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem' }}>🔧 WonderKits 客户端状态</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: connected ? '#10b981' : '#ef4444',
          display: 'inline-block'
        }}></span>
        <span style={{ fontSize: '14px' }}>
          {connected ? `已连接 (${clientMode})` : '未连接'}
        </span>
        {services.length > 0 && (
          <span style={{ fontSize: '12px', opacity: '0.8' }}>
            已初始化服务: {services.join(', ')}
          </span>
        )}
      </div>
      
      <p style={{ fontSize: '12px', margin: '8px 0 0 0', opacity: '0.8' }}>
        💡 应用启动时自动初始化所有服务（SQL、文件系统、键值存储）
      </p>
    </div>
  );
};
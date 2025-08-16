interface ConnectionStatusProps {
  connected: boolean;
  clientMode?: string;
  connectionString: string;
  setConnectionString: (value: string) => void;
}

export const ConnectionStatus = ({ 
  connected, 
  clientMode, 
  connectionString, 
  setConnectionString 
}: ConnectionStatusProps) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '16px',
      marginBottom: '24px',
      padding: '16px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px'
    }}>
      <div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '8px' 
        }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: connected ? '#10b981' : '#ef4444',
            display: 'inline-block'
          }}></span>
          <span style={{ color: 'white', fontWeight: 'bold' }}>
            {connected ? '已连接' : '未连接'}
          </span>
          {connected && (
            <span style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '14px' 
            }}>
              模式: {clientMode}
            </span>
          )}
        </div>
        
        <input
          type="text"
          value={connectionString}
          onChange={(e) => setConnectionString(e.target.value)}
          disabled={connected}
          placeholder="数据库连接字符串 (例如: sqlite:mydb.db)"
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '14px'
          }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          color: 'white',
          fontSize: '14px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: connected ? '#10b981' : '#ef4444',
            display: 'inline-block'
          }}></span>
          数据库服务: {connected ? '已就绪' : '初始化中...'}
          {connected && (
            <span style={{ opacity: '0.8', fontSize: '13px' }}>
              ({clientMode})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
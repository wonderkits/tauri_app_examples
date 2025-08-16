import { useState } from 'react';

interface Props {
  isInWujie: boolean;
  parentProps?: any;
}

export const EnvironmentCards = ({ isInWujie, parentProps }: Props) => {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    }}>
      {/* 环境信息卡片 */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem' }}>🌍 运行环境</h3>
        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
          <p><strong>模式:</strong> {isInWujie ? 'Wujie微前端' : '独立运行'}</p>
          <p><strong>端口:</strong> 3001</p>
          <p><strong>时间:</strong> {new Date().toLocaleTimeString()}</p>
          {isInWujie && (
            <p><strong>父应用:</strong> {parentProps?.parentAppName || 'unknown'}</p>
          )}
        </div>
      </div>

      {/* 交互演示卡片 */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem' }}>🎮 交互演示</h3>
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => setCount(count + 1)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              color: 'white',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            点击计数: {count}
          </button>
        </div>
      </div>
    </div>
  );
};
interface Props {
  isInWujie: boolean;
  parentProps?: any;
  messages: string[];
  onSendMessage: () => void;
}

export const CommunicationCards = ({ isInWujie, parentProps, messages, onSendMessage }: Props) => {
  return (
    <>
      {/* 通信演示 */}
      {isInWujie && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem' }}>📡 应用间通信</h3>
          <button
            onClick={onSendMessage}
            style={{
              background: '#10b981',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#059669';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#10b981';
            }}
          >
            向父应用发送消息
          </button>
          
          {messages.length > 0 && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>消息历史:</div>
              {messages.map((msg, index) => (
                <div key={index} style={{ marginBottom: '4px', opacity: 1 - index * 0.2 }}>
                  {msg}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Props展示 */}
      {parentProps && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem' }}>📋 父应用传递的Props</h3>
          <pre style={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '12px',
            overflow: 'auto',
            margin: 0
          }}>
            {JSON.stringify(parentProps, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
};
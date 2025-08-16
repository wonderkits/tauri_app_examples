interface Props {
  logs: string[];
  height?: string;
  title?: string;
}

export const LogViewer = ({ logs, height = '150px', title = '操作日志' }: Props) => {
  return (
    <div>
      <h3 style={{ color: 'white', margin: '0 0 12px 0', fontSize: '1.2rem' }}>
        📝 {title}
      </h3>
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
        padding: '12px',
        height,
        overflowY: 'auto',
        fontSize: '12px',
        fontFamily: 'Monaco, Consolas, monospace'
      }}>
        {logs.map((log, index) => (
          <div
            key={index}
            style={{
              color: log.includes('❌') ? '#ef4444' : 
                     log.includes('✅') ? '#10b981' : 
                     log.includes('🔄') ? '#3b82f6' : 
                     'rgba(255, 255, 255, 0.8)',
              marginBottom: '2px',
              lineHeight: '1.4'
            }}
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
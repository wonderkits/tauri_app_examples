import { OperationResult } from '../../types';

interface Props {
  title: string;
  operations: OperationResult[];
  onClear: () => void;
  maxHeight?: string;
}

// 格式化结果显示
const formatResult = (result: any) => {
  if (Array.isArray(result)) {
    return JSON.stringify(result, null, 2);
  } else if (typeof result === 'object') {
    return JSON.stringify(result, null, 2);
  }
  return String(result);
};

export const OperationHistory = ({ title, operations, onClear, maxHeight = '300px' }: Props) => {
  if (operations.length === 0) return null;

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px' 
      }}>
        <h3 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>
          📊 {title}
        </h3>
        <button
          onClick={onClear}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
            color: 'white',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          清空历史
        </button>
      </div>
      
      <div style={{ maxHeight, overflowY: 'auto' }}>
        {operations.map((operation) => (
          <div
            key={operation.timestamp}
            style={{
              background: operation.success 
                ? 'rgba(16, 185, 129, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${operation.success 
                ? 'rgba(16, 185, 129, 0.3)' 
                : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '8px'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{
                color: operation.success ? '#10b981' : '#ef4444',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {operation.success ? '✅ 成功' : '❌ 失败'} | {operation.type.toUpperCase()}
              </span>
              <span style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '11px'
              }}>
                {new Date(operation.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            {/* 显示操作详情 */}
            {'sql' in operation && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '4px',
                padding: '8px',
                marginBottom: '8px'
              }}>
                <code style={{
                  color: 'white',
                  fontSize: '11px',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  {(operation as any).sql}
                </code>
              </div>
            )}

            {'path' in operation && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '4px',
                padding: '8px',
                marginBottom: '8px'
              }}>
                <code style={{
                  color: 'white',
                  fontSize: '11px',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  路径: {(operation as any).path}
                </code>
              </div>
            )}

            {'key' in operation && (operation as any).key && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '4px',
                padding: '8px',
                marginBottom: '8px'
              }}>
                <code style={{
                  color: 'white',
                  fontSize: '11px',
                  fontFamily: 'Monaco, Consolas, monospace'
                }}>
                  键: {(operation as any).key}
                  {'value' in operation && (operation as any).value !== undefined && (
                    <>
                      <br />值: {JSON.stringify((operation as any).value)}
                    </>
                  )}
                </code>
              </div>
            )}
            
            {operation.success && operation.result && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '4px',
                padding: '8px',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                <pre style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '11px',
                  fontFamily: 'Monaco, Consolas, monospace',
                  margin: 0,
                  whiteSpace: 'pre-wrap'
                }}>
                  {formatResult(operation.result)}
                </pre>
              </div>
            )}
            
            {!operation.success && operation.error && (
              <div style={{
                color: '#ef4444',
                fontSize: '12px',
                fontFamily: 'Monaco, Consolas, monospace'
              }}>
                错误: {operation.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
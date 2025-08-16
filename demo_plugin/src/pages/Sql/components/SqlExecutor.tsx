interface SqlExecutorProps {
  currentSql: string;
  setCurrentSql: (sql: string) => void;
  onExecute: () => void;
  loading: boolean;
}

export const SqlExecutor = ({ currentSql, setCurrentSql, onExecute, loading }: SqlExecutorProps) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ color: 'white', margin: '0 0 12px 0', fontSize: '1.2rem' }}>
        💻 SQL 执行器
      </h3>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        padding: '16px'
      }}>
        <textarea
          value={currentSql}
          onChange={(e) => setCurrentSql(e.target.value)}
          placeholder="在此输入 SQL 语句..."
          style={{
            width: '100%',
            height: '120px',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(0, 0, 0, 0.3)',
            color: 'white',
            fontSize: '13px',
            fontFamily: 'Monaco, Consolas, monospace',
            resize: 'vertical',
            marginBottom: '12px'
          }}
        />
        <div className="flex gap-2">
          <button
            onClick={onExecute}
            disabled={!currentSql.trim() || loading}
            className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed 
                     text-white font-bold py-2 px-4 rounded transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {loading ? '执行中...' : '🚀 执行 SQL'}
          </button>
          <button
            onClick={() => setCurrentSql('')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded 
                     transition-colors duration-200 border border-gray-300
                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            🗑️ 清空
          </button>
        </div>
      </div>
    </div>
  );
};
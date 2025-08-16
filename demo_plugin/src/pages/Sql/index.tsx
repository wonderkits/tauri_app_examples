import { OperationHistory } from '../../components/OperationHistory';
import { LogViewer } from '../../components/LogViewer';
import { getLayout } from '../../layouts';
import { useSqlManager } from './hooks/useSqlManager';
import { 
  ConnectionStatus, 
  SqlTemplates, 
  SqlExecutor, 
  InitializingView 
} from './components';

const SqlPage = () => {
  const {
    connected,
    loading,
    logs,
    clientMode,
    connectionString,
    setConnectionString,
    currentSql,
    setCurrentSql,
    sqlHistory,
    executeSql,
    clearHistory
  } = useSqlManager();

  // 使用默认布局
  const Layout = getLayout('default');

  return (
    <Layout>
      <div style={{ 
        padding: '20px', 
        background: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '12px',
        minHeight: '80vh'
      }}>
        <h2 style={{ margin: '0 0 24px 0', color: 'white', fontSize: '1.8rem' }}>
          🗄️ SQL 数据库管理
        </h2>

        <ConnectionStatus
          connected={connected}
          clientMode={clientMode}
          connectionString={connectionString}
          setConnectionString={setConnectionString}
        />

        {connected ? (
          <>
            <SqlTemplates onSelectTemplate={setCurrentSql} />
            
            <SqlExecutor
              currentSql={currentSql}
              setCurrentSql={setCurrentSql}
              onExecute={executeSql}
              loading={loading}
            />

            <OperationHistory
              title="执行历史"
              operations={sqlHistory}
              onClear={clearHistory}
              maxHeight="400px"
            />

            <LogViewer logs={logs} height="200px" />
          </>
        ) : (
          <InitializingView />
        )}
      </div>
    </Layout>
  );
};


export default SqlPage;
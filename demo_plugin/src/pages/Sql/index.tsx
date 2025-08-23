import { OperationHistory } from '../../components/OperationHistory';
import { getLayout } from '../../layouts';
import { useSqlManager } from './hooks/useSqlManager';
import { ConnectionStatus, SqlTemplates, SqlExecutor } from './components';
import { getWonderKitsClient } from '@wonderkits/client';

const SqlPage = () => {
  const {
    connectionString,
    setConnectionString,
    currentSql,
    setCurrentSql,
    sqlHistory,
    executeSql,
    clearHistory,
  } = useSqlManager();

  // 使用默认布局
  const Layout = getLayout('default');

  return (
    <Layout>
      <div
        style={{
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          minHeight: '80vh',
        }}
      >
        <h2 style={{ margin: '0 0 24px 0', color: 'white', fontSize: '1.8rem' }}>
          🗄️ SQL 数据库管理
        </h2>

        <ConnectionStatus
          connected={true}
          clientMode={getWonderKitsClient().getMode()}
          connectionString={connectionString}
          setConnectionString={setConnectionString}
        />
        <SqlTemplates onSelectTemplate={setCurrentSql} />

        <SqlExecutor
          currentSql={currentSql}
          setCurrentSql={setCurrentSql}
          onExecute={executeSql}
          loading={false}
        />

        <OperationHistory
          title="执行历史"
          operations={sqlHistory}
          onClear={clearHistory}
          maxHeight="400px"
        />
      </div>
    </Layout>
  );
};

export default SqlPage;

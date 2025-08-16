import { useState, useEffect, useMemo } from 'react';
import { 
  useWonderKits,
  useWonderKitsConnected,
  useWonderKitsLoading
} from '@wonderkits/client';
import { QueryResult } from '../../../types';
import { SqlService } from '../../../services';

export const useSqlManager = () => {
  // 全局状态
  const connected = useWonderKitsConnected();
  const loading = useWonderKitsLoading();
  const { logs, addLog, clientMode, client } = useWonderKits();
  
  // 获取 SQL 客户端
  const sqlClient = client?.sql();
  const sqlAvailable = connected && client?.isServiceInitialized('sql');
  
  // 创建 SQL 服务实例
  const sqlService = useMemo(() => {
    if (!sqlClient) return null;
    return new SqlService(sqlClient, addLog);
  }, [sqlClient, addLog]);
  
  // 本地状态
  const [connectionString, setConnectionString] = useState('sqlite:test.db');
  const [currentSql, setCurrentSql] = useState('');
  const [sqlHistory, setSqlHistory] = useState<QueryResult[]>([]);

  // 执行 SQL
  const executeSql = async () => {
    if (!currentSql.trim()) {
      addLog('⚠️ 请输入 SQL 语句');
      return;
    }
    
    if (!sqlService || !sqlAvailable) {
      addLog('❌ SQL 服务不可用');
      return;
    }

    const result = await sqlService.execute(currentSql.trim());
    setSqlHistory(prev => [result, ...prev.slice(0, 9)]);
  };

  // 清空历史记录
  const clearHistory = () => setSqlHistory([]);

  // 页面初始化
  useEffect(() => {
    addLog('🚀 SQL 功能页面已加载');
    addLog('💡 SQL 功能页面已加载，等待服务就绪');
  }, [addLog]);

  return {
    // 状态
    connected,
    loading,
    logs,
    clientMode,
    sqlAvailable,
    connectionString,
    setConnectionString,
    currentSql,
    setCurrentSql,
    sqlHistory,
    
    // 操作
    executeSql,
    clearHistory
  };
};
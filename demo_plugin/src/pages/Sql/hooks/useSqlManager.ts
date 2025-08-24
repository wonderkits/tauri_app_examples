import { useState, useMemo } from 'react';

import { QueryResult } from '../../../types';
import { SqlService } from '../../../services';
import { getSql } from '@wonderkits/client';

export const useSqlManager = () => {
  // 全局状态

  const useSql = () => getSql();

  // 获取 SQL 客户端
  const sqlClient = useSql();

  // 创建 SQL 服务实例
  const sqlService = useMemo(() => {
    if (!sqlClient) return null;
    return new SqlService(sqlClient);
  }, [sqlClient]);

  // 本地状态
  const [connectionString, setConnectionString] = useState('sqlite:test.db');
  const [currentSql, setCurrentSql] = useState('');
  const [sqlHistory, setSqlHistory] = useState<QueryResult[]>([]);

  // 执行 SQL
  const executeSql = async () => {
    if (!currentSql.trim()) {
      return;
    }

    const result = await sqlService!.execute(currentSql.trim());
    setSqlHistory(prev => [result, ...prev.slice(0, 9)]);
  };

  // 清空历史记录
  const clearHistory = () => setSqlHistory([]);

  // 页面初始化

  return {
    // 状态
    connectionString,
    setConnectionString,
    currentSql,
    setCurrentSql,
    sqlHistory,

    // 操作
    executeSql,
    clearHistory,
  };
};

import { useState, useCallback } from 'react';
import { useWonderKitsClient, useWonderKits } from '@wonderkits/client/react';
import { StoreOperation } from '../../../types';
import { StoreService } from '../../../services';

export const useStoreOperations = (storeService: StoreService | null) => {
  const wonderClient = useWonderKitsClient();
  const { addLog } = useWonderKits();
  
  // 本地状态
  const [storeHistory, setStoreHistory] = useState<StoreOperation[]>([]);
  const [currentKey, setCurrentKey] = useState('username');
  const [currentValue, setCurrentValue] = useState('张三');
  const [storeEntries, setStoreEntries] = useState<[string, any][]>([]);

  // 设置值
  const setValue = useCallback(async (key?: string, value?: any) => {
    if (!storeService) {
      addLog('❌ Store 服务不可用');
      return;
    }

    const storeKey = key || currentKey;
    let storeValue = value;
    
    if (storeValue === undefined) {
      try {
        storeValue = JSON.parse(currentValue);
      } catch {
        storeValue = currentValue;
      }
    }
    
    const result = await storeService.setValue(storeKey, storeValue);
    setStoreHistory(prev => [result, ...prev.slice(0, 9)]);
    
    // 刷新条目列表
    await getEntries();
  }, [storeService, currentKey, currentValue, addLog]);

  // 获取值
  const getValue = useCallback(async (key?: string) => {
    if (!wonderClient) return;

    const storeKey = key || currentKey;
    
    try {
      addLog(`🔄 获取值: ${storeKey}`);
      const value = await wonderClient.store().get(storeKey);
      addLog(`✅ 获取值成功: ${storeKey} = ${JSON.stringify(value)}`);

      const operation: StoreOperation = {
        type: 'get',
        key: storeKey,
        result: { value },
        timestamp: Date.now(),
        success: true
      };

      setStoreHistory(prev => [operation, ...prev.slice(0, 9)]);
      
      // 如果获取的是当前编辑的键，更新编辑器
      if (storeKey === currentKey && value !== null) {
        setCurrentValue(typeof value === 'string' ? value : JSON.stringify(value, null, 2));
      }
      
    } catch (error: any) {
      addLog(`❌ 获取值失败: ${error.message}`);
      
      const operation: StoreOperation = {
        type: 'get',
        key: storeKey,
        result: null,
        timestamp: Date.now(),
        success: false,
        error: error.message
      };

      setStoreHistory(prev => [operation, ...prev.slice(0, 9)]);
    }
  }, [wonderClient, currentKey, addLog]);

  // 获取所有条目
  const getEntries = useCallback(async () => {
    if (!wonderClient) return;
    
    try {
      addLog('🔄 获取所有条目...');
      const entries = await wonderClient.store().entries();
      addLog(`✅ 获取条目成功，共 ${entries.length} 个条目`);

      const operation: StoreOperation = {
        type: 'entries',
        result: { entries },
        timestamp: Date.now(),
        success: true
      };

      setStoreHistory(prev => [operation, ...prev.slice(0, 9)]);
      setStoreEntries(entries);
      
    } catch (error: any) {
      addLog(`❌ 获取条目失败: ${error.message}`);
      
      const operation: StoreOperation = {
        type: 'entries',
        result: null,
        timestamp: Date.now(),
        success: false,
        error: error.message
      };

      setStoreHistory(prev => [operation, ...prev.slice(0, 9)]);
    }
  }, [wonderClient, addLog]);

  // 删除键
  const deleteKey = useCallback(async (key?: string) => {
    if (!wonderClient) return;

    const storeKey = key || currentKey;
    
    try {
      addLog(`🔄 删除键: ${storeKey}`);
      const success = await wonderClient.store().delete(storeKey);
      addLog(`✅ 删除键${success ? '成功' : '失败'}: ${storeKey}`);

      const operation: StoreOperation = {
        type: 'delete',
        key: storeKey,
        result: { success },
        timestamp: Date.now(),
        success: true
      };

      setStoreHistory(prev => [operation, ...prev.slice(0, 9)]);
      
      // 刷新条目列表
      await getEntries();
      
    } catch (error: any) {
      addLog(`❌ 删除键失败: ${error.message}`);
      
      const operation: StoreOperation = {
        type: 'delete',
        key: storeKey,
        result: null,
        timestamp: Date.now(),
        success: false,
        error: error.message
      };

      setStoreHistory(prev => [operation, ...prev.slice(0, 9)]);
    }
  }, [wonderClient, currentKey, addLog, getEntries]);

  // 清空 Store
  const clearStore = useCallback(async () => {
    if (!wonderClient) return;
    
    try {
      addLog('🔄 清空 Store...');
      await wonderClient.store().clear();
      addLog('✅ Store 清空成功');

      const operation: StoreOperation = {
        type: 'clear',
        result: { success: true },
        timestamp: Date.now(),
        success: true
      };

      setStoreHistory(prev => [operation, ...prev.slice(0, 9)]);
      setStoreEntries([]);
      
    } catch (error: any) {
      addLog(`❌ 清空 Store 失败: ${error.message}`);
      
      const operation: StoreOperation = {
        type: 'clear',
        result: null,
        timestamp: Date.now(),
        success: false,
        error: error.message
      };

      setStoreHistory(prev => [operation, ...prev.slice(0, 9)]);
    }
  }, [wonderClient, addLog]);

  return {
    // 状态
    storeHistory,
    currentKey,
    currentValue,
    storeEntries,
    
    // 状态更新函数
    setStoreHistory,
    setCurrentKey,
    setCurrentValue,
    
    // 操作函数
    setValue,
    getValue,
    getEntries,
    deleteKey,
    clearStore
  };
};
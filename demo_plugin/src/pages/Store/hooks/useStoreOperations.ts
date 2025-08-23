import { useState, useCallback } from 'react';
import { StoreOperation } from '../../../types';
import { StoreService } from '../../../services';
import { getStore } from '@wonderkits/client';

export const useStoreOperations = (storeService: StoreService | null) => {
  // 本地状态
  const [storeHistory, setStoreHistory] = useState<StoreOperation[]>([]);
  const [currentKey, setCurrentKey] = useState('username');
  const [currentValue, setCurrentValue] = useState('张三');
  const [storeEntries, setStoreEntries] = useState<[string, any][]>([]);

  // 设置值
  const setValue = useCallback(
    async (key?: string, value?: any) => {
      if (!storeService) {
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
    },
    [storeService, currentKey, currentValue]
  );

  // 获取值
  const getValue = useCallback(
    async (key?: string) => {
      const storeKey = key || currentKey;

      try {
        const value = await getStore().get(storeKey);

        const operation: StoreOperation = {
          type: 'get',
          key: storeKey,
          result: { value },
          timestamp: Date.now(),
          success: true,
        };

        setStoreHistory(prev => [operation, ...prev.slice(0, 9)]);

        // 如果获取的是当前编辑的键，更新编辑器
        if (storeKey === currentKey && value !== null) {
          setCurrentValue(typeof value === 'string' ? value : JSON.stringify(value, null, 2));
        }
      } catch (error: any) {
        const operation: StoreOperation = {
          type: 'get',
          key: storeKey,
          result: null,
          timestamp: Date.now(),
          success: false,
          error: error.message,
        };

        setStoreHistory(prev => [operation, ...prev.slice(0, 9)]);
      }
    },
    [currentKey]
  );

  // 获取所有条目
  const getEntries = useCallback(async () => {
    try {
      const entries = await getStore().entries();

      const operation: StoreOperation = {
        type: 'entries',
        result: { entries },
        timestamp: Date.now(),
        success: true,
      };

      setStoreHistory(prev => [operation, ...prev.slice(0, 9)]);
      setStoreEntries(entries);
    } catch (error: any) {
      const operation: StoreOperation = {
        type: 'entries',
        result: null,
        timestamp: Date.now(),
        success: false,
        error: error.message,
      };

      setStoreHistory(prev => [operation, ...prev.slice(0, 9)]);
    }
  }, []);

  // 删除键
  const deleteKey = useCallback(async (key?: string) => {
    const storeKey = key || currentKey;
    try {
      const success = await getStore().delete(storeKey);

      const operation: StoreOperation = {
        type: 'delete',
        key: storeKey,
        result: { success },
        timestamp: Date.now(),
        success: true,
      };

      setStoreHistory(prev => [operation, ...prev.slice(0, 9)]);

      // 刷新条目列表
      await getEntries();
    } catch (error: any) {
      const operation: StoreOperation = {
        type: 'delete',
        key: storeKey,
        result: null,
        timestamp: Date.now(),
        success: false,
        error: error.message,
      };

      setStoreHistory(prev => [operation, ...prev.slice(0, 9)]);
    }
  }, []);

  // 清空 Store
  const clearStore = useCallback(async () => {
    try {
      await getStore().clear();

      const operation: StoreOperation = {
        type: 'clear',
        result: { success: true },
        timestamp: Date.now(),
        success: true,
      };

      setStoreHistory(prev => [operation, ...prev.slice(0, 9)]);
      setStoreEntries([]);
    } catch (error: any) {
      const operation: StoreOperation = {
        type: 'clear',
        result: null,
        timestamp: Date.now(),
        success: false,
        error: error.message,
      };

      setStoreHistory(prev => [operation, ...prev.slice(0, 9)]);
    }
  }, []);

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
    clearStore,
  };
};

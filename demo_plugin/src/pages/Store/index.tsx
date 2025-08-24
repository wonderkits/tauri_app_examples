import { useState, useMemo } from 'react';

import { OperationTemplate } from '../../types';
import { OperationHistory } from '../../components/OperationHistory';
import { getLayout } from '../../layouts';
import { StoreService } from '../../services';
import {
  ConnectionStatus,
  OperationTemplates,
  KeyValueOperations,
  StoreBrowser,
} from './components';
import { useStoreOperations } from './hooks/useStoreOperations';
import { getStore, getWonderKitsClient } from '@wonderkits/client';

const StorePage = () => {
  // 获取 Store 客户端
  const storeClient = getStore();

  // 创建 Store 服务实例
  const storeService = useMemo(() => {
    if (!storeClient) return null;
    return new StoreService(storeClient);
  }, [storeClient]);

  // 使用 Store 操作 hook
  const {
    storeHistory,
    currentKey,
    currentValue,
    storeEntries,
    setStoreHistory,
    setCurrentKey,
    setCurrentValue,
    setValue,
    getValue,
    getEntries,
    deleteKey,
    clearStore,
  } = useStoreOperations(storeService);

  // Store 文件名状态（页面级别的 UI 状态）
  const [storeFilename, setStoreFilename] = useState('demo-settings.json');

  // 预设的 Store 操作模板
  const storeTemplates: OperationTemplate[] = [
    {
      name: '设置用户信息',
      action: async () => {
        if (!storeService) return;
        const result = await storeService.setValue('user', {
          name: '张三',
          age: 25,
          email: 'zhangsan@example.com',
        });
        setStoreHistory(prev => [result, ...prev.slice(0, 9)]);
        await getEntries();
      },
    },
    {
      name: '设置应用设置',
      action: async () => {
        if (!storeService) return;
        const result = await storeService.setValue('settings', {
          theme: 'dark',
          language: 'zh-CN',
          autoSave: true,
        });
        setStoreHistory(prev => [result, ...prev.slice(0, 9)]);
        await getEntries();
      },
    },
    {
      name: '获取用户信息',
      action: async () => {
        if (!storeService) return;
        const result = await storeService.getValue('user');
        setStoreHistory(prev => [result, ...prev.slice(0, 9)]);
      },
    },
    {
      name: '获取所有条目',
      action: () => getEntries(),
    },
  ];

  // 使用默认布局
  const Layout = getLayout('default');

  return (
    <Layout>
      <div className="p-5 bg-white/10 rounded-xl min-h-[80vh]">
        <h2 className="mb-6 text-white text-3xl font-bold">💾 键值存储管理</h2>

        {/* 连接状态和控制 */}
        <ConnectionStatus
          connected={true}
          clientMode={getWonderKitsClient().getMode()}
          storeFilename={storeFilename}
          onStoreFilenameChange={setStoreFilename}
        />

        {/* Store 操作模板区域 */}
        <OperationTemplates templates={storeTemplates} loading={false} />

        {/* 键值操作区域 */}
        <KeyValueOperations
          currentKey={currentKey}
          currentValue={currentValue}
          loading={false}
          onKeyChange={setCurrentKey}
          onValueChange={setCurrentValue}
          onSetValue={() => setValue()}
          onGetValue={() => getValue()}
          onDeleteKey={() => deleteKey()}
          onClearStore={clearStore}
        />

        {/* Store 内容浏览区域 */}
        <StoreBrowser
          storeEntries={storeEntries}
          loading={false}
          onRefreshEntries={() => getEntries()}
          onSelectEntry={(key, value) => {
            setCurrentKey(key);
            setCurrentValue(typeof value === 'string' ? value : JSON.stringify(value, null, 2));
          }}
        />

        {/* 操作历史 */}
        <OperationHistory
          title="操作历史"
          operations={storeHistory}
          onClear={() => setStoreHistory([])}
          maxHeight="300px"
        />
      </div>
    </Layout>
  );
};

export default StorePage;

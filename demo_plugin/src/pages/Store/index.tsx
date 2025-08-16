import { useState, useEffect, useMemo } from 'react';
import { 
  useWonderKits,
  useWonderKitsConnected,
  useWonderKitsLoading
} from '@wonderkits/client/react';
import { OperationTemplate } from '../../types';
import { OperationHistory } from '../../components/OperationHistory';
import { LogViewer } from '../../components/LogViewer';
import { getLayout } from '../../layouts';
import { StoreService } from '../../services';
import { 
  ConnectionStatus, 
  OperationTemplates, 
  KeyValueOperations, 
  StoreBrowser 
} from './components';
import { useStoreOperations } from './hooks/useStoreOperations';

const StorePage = () => {
  // 使用全局状态
  const connected = useWonderKitsConnected();
  const loading = useWonderKitsLoading();
  const { logs, addLog, clientMode, client } = useWonderKits();
  
  // 获取 Store 客户端
  const storeClient = client?.store();
  
  // 创建 Store 服务实例
  const storeService = useMemo(() => {
    if (!storeClient) return null;
    return new StoreService(storeClient, addLog);
  }, [storeClient, addLog]);
  
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
    clearStore
  } = useStoreOperations(storeService);
  
  // Store 文件名状态（页面级别的 UI 状态）
  const [storeFilename, setStoreFilename] = useState('demo-settings.json');

  // 预设的 Store 操作模板
  const storeTemplates: OperationTemplate[] = [
    {
      name: '设置用户信息',
      action: async () => {
        if (!storeService) return;
        const result = await storeService.setValue('user', { name: '张三', age: 25, email: 'zhangsan@example.com' });
        setStoreHistory(prev => [result, ...prev.slice(0, 9)]);
        await getEntries();
      }
    },
    {
      name: '设置应用设置',
      action: async () => {
        if (!storeService) return;
        const result = await storeService.setValue('settings', { theme: 'dark', language: 'zh-CN', autoSave: true });
        setStoreHistory(prev => [result, ...prev.slice(0, 9)]);
        await getEntries();
      }
    },
    {
      name: '获取用户信息',
      action: async () => {
        if (!storeService) return;
        const result = await storeService.getValue('user');
        setStoreHistory(prev => [result, ...prev.slice(0, 9)]);
      }
    },
    {
      name: '获取所有条目',
      action: () => getEntries()
    }
  ];


  // 自动初始化
  useEffect(() => {
    addLog('🚀 Store 功能页面已加载');
  }, []);

  // 使用默认布局
  const Layout = getLayout('default');

  return (
    <Layout>
    <div className="p-5 bg-white/10 rounded-xl min-h-[80vh]">
      <h2 className="mb-6 text-white text-3xl font-bold">
        💾 键值存储管理
      </h2>

      {/* 连接状态和控制 */}
      <ConnectionStatus
        connected={connected}
        clientMode={clientMode}
        storeFilename={storeFilename}
        onStoreFilenameChange={setStoreFilename}
      />

      {connected && (
        <>
          {/* Store 操作模板区域 */}
          <OperationTemplates
            templates={storeTemplates}
            loading={loading}
          />

          {/* 键值操作区域 */}
          <KeyValueOperations
            currentKey={currentKey}
            currentValue={currentValue}
            loading={loading}
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
            loading={loading}
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

          {/* 日志区域 */}
          <LogViewer logs={logs} height="150px" />
        </>
      )}

      {!connected && (
        <div className="text-center py-10 text-white/60">
          <h3>⏳ 键值存储服务初始化中...</h3>
          <p>请稍等，服务将自动就绪</p>
          <p className="text-sm mt-5">
            💡 自动检测运行环境：
            <br />
            • Tauri 应用中使用原生 Store 插件
            <br />
            • 独立开发中使用 HTTP Store 服务
          </p>
        </div>
      )}
    </div>
    </Layout>
  );
};


export default StorePage;
import { useEffect, useMemo } from 'react';

import { OperationTemplate } from '../../types';
import { OperationHistory } from '../../components/OperationHistory';
import { FsService } from '../../services';
import { getLayout } from '../../layouts';
import {
  ServiceStatus,
  FsOperationTemplates,
  FileOperations,
  DirectoryBrowser,
} from './components';
import { useFsOperations } from './hooks/useFsOperations';
import { getFs, getWonderKitsClient } from '@wonderkits/client';

const FsPage = () => {
  // 使用全局状态

  // 获取 FS 客户端
  const fsClient = getFs();

  // 创建 FS 服务实例
  const fsService = useMemo(() => {
    if (!fsClient) return null;
    return new FsService(fsClient);
  }, [fsClient]);

  // 使用 FS 操作 hook
  const {
    fsHistory,
    currentPath,
    fileContent,
    currentDir,
    dirEntries,
    setFsHistory,
    setCurrentPath,
    setFileContent,
    setCurrentDir,
    writeFile,
    readFile,
    readDirectory,
  } = useFsOperations(fsService, fsClient);

  // 预设的文件操作模板
  const fsTemplates: OperationTemplate[] = [
    {
      name: '创建测试文件 (HOME)',
      action: async () => {
        if (!fsService) return;
        const result = await fsService.writeFile(
          '$HOME/test.txt',
          'Hello, Tauri FS!\n这是一个测试文件。\n当前时间: ' + new Date().toLocaleString()
        );
        setFsHistory(prev => [result, ...prev.slice(0, 9)]);
      },
    },
    {
      name: '创建 JSON 配置 (HOME)',
      action: async () => {
        if (!fsService) return;
        const content = JSON.stringify(
          {
            name: 'Demo App',
            version: '1.0.0',
            settings: {
              theme: 'dark',
              language: 'zh-CN',
            },
          },
          null,
          2
        );
        const result = await fsService.writeFile('$HOME/config.json', content);
        setFsHistory(prev => [result, ...prev.slice(0, 9)]);
      },
    },
    {
      name: '读取测试文件',
      action: async () => {
        if (!fsService) return;
        const result = await fsService.readFile('$HOME/test.txt');
        setFsHistory(prev => [result, ...prev.slice(0, 9)]);
        if (result.success && result.result?.content) {
          setFileContent(result.result.content);
        }
      },
    },
  ];

  // 自动初始化
  useEffect(() => {}, []);

  // 使用默认布局
  const Layout = getLayout('default');

  return (
    <Layout>
      <div className="p-5 bg-white/10 rounded-xl min-h-[80vh]">
        <h2 className="mb-6 text-white text-3xl font-bold">📁 文件系统管理</h2>

        {/* 服务状态显示 */}
        <ServiceStatus connected={false} clientMode={getWonderKitsClient().getMode()} />

        {/* FS 操作模板区域 */}
        <FsOperationTemplates templates={fsTemplates} loading={false} />

        {/* 文件操作区域 */}
        <FileOperations
          currentPath={currentPath}
          fileContent={fileContent}
          loading={false}
          onPathChange={setCurrentPath}
          onContentChange={setFileContent}
          onWriteFile={() => writeFile()}
          onReadFile={() => readFile()}
        />

        {/* 目录浏览区域 */}
        <DirectoryBrowser
          currentDir={currentDir}
          dirEntries={dirEntries}
          loading={false}
          onDirChange={setCurrentDir}
          onReadDirectory={() => readDirectory()}
        />

        {/* 操作历史 */}
        <OperationHistory
          title="操作历史"
          operations={fsHistory}
          onClear={() => setFsHistory([])}
          maxHeight="300px"
        />
      </div>
    </Layout>
  );
};

export default FsPage;

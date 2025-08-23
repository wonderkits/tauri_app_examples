import { useState, useCallback } from 'react';
import { type DirEntry } from '@wonderkits/client';
import { FsOperation } from '../../../types';
import { FsService } from '../../../services';

export const useFsOperations = (fsService: FsService | null, fsClient: any) => {
  // 本地状态
  const [fsHistory, setFsHistory] = useState<FsOperation[]>([]);
  const [currentPath, setCurrentPath] = useState('$HOME/test.txt');
  const [fileContent, setFileContent] = useState('Hello, Tauri FS!\n这是一个测试文件。');
  const [currentDir, setCurrentDir] = useState('$HOME');
  const [dirEntries, setDirEntries] = useState<DirEntry[]>([]);

  // 写入文件
  const writeFile = useCallback(
    async (path?: string, content?: string) => {
      if (!fsService) {
        return;
      }

      const filePath = path || currentPath;
      const fileData = content || fileContent;

      const result = await fsService.writeFile(filePath, fileData);
      setFsHistory(prev => [result, ...prev.slice(0, 9)]);
    },
    [fsService, currentPath, fileContent]
  );

  // 读取文件
  const readFile = useCallback(
    async (path?: string) => {
      if (!fsService) {
        return;
      }

      const filePath = path || currentPath;
      const result = await fsService.readFile(filePath);
      setFsHistory(prev => [result, ...prev.slice(0, 9)]);

      if (result.success && result.result?.content) {
        setFileContent(result.result.content);
      }
    },
    [fsService, currentPath]
  );

  // 读取目录
  const readDirectory = useCallback(
    async (path?: string) => {
      if (!fsClient) {
        return;
      }

      const dirPath = path || currentDir;

      try {
        const entries = await fsClient.readDir(dirPath);
        setDirEntries(entries);
      } catch (error: any) {
        console.error(`❌ 读取目录失败: ${error}`);
      }
    },
    [fsClient, currentDir]
  );

  return {
    // 状态
    fsHistory,
    currentPath,
    fileContent,
    currentDir,
    dirEntries,

    // 状态更新函数
    setFsHistory,
    setCurrentPath,
    setFileContent,
    setCurrentDir,

    // 操作函数
    writeFile,
    readFile,
    readDirectory,
  };
};

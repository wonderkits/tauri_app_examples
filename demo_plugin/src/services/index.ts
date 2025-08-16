import { QueryResult, FsOperation, StoreOperation } from '../types';

// 通用操作执行器
export const executeOperation = async <TSuccess, TError = TSuccess>(
  operation: () => Promise<any>,
  createResult: (result: any) => TSuccess,
  createError: (error: string) => TError
): Promise<TSuccess | TError> => {
  try {
    const result = await operation();
    return createResult(result);
  } catch (error: any) {
    return createError(error.message);
  }
};

// SQL Service
export class SqlService {
  constructor(private client: any, private addLog: (log: string) => void) {}

  async execute(sql: string): Promise<QueryResult> {
    const timestamp = Date.now();
    
    return executeOperation(
      async () => {
        this.addLog(`🔄 执行 SQL: ${sql.substring(0, 50)}${sql.length > 50 ? '...' : ''}`);
        
        let result: any;
        let type: 'select' | 'execute';

        if (sql.toLowerCase().startsWith('select')) {
          result = await this.client.select(sql);
          type = 'select';
          this.addLog(`✅ 查询成功，返回 ${result.length} 行数据`);
        } else {
          result = await this.client.execute(sql);
          type = 'execute';
          this.addLog(`✅ 执行成功，影响 ${result.rowsAffected} 行`);
        }

        return { result, type };
      },
      ({ result, type }) => ({
        type,
        sql,
        result,
        timestamp,
        success: true
      }),
      (error) => {
        this.addLog(`❌ SQL 执行失败: ${error}`);
        return {
          type: 'execute' as const,
          sql,
          result: null,
          timestamp,
          success: false,
          error
        };
      }
    );
  }
}

// FS Service  
export class FsService {
  constructor(private client: any, private addLog: (log: string) => void) {}

  async writeFile(path: string, content: string): Promise<FsOperation> {
    const timestamp = Date.now();
    
    return executeOperation(
      async () => {
        this.addLog(`🔄 写入文件: ${path}`);
        await this.client.writeTextFile(path, content);
        this.addLog(`✅ 文件写入成功: ${path}`);
        return { bytes: content.length };
      },
      (result) => ({
        type: 'write' as const,
        path,
        result,
        timestamp,
        success: true
      }),
      (error) => {
        this.addLog(`❌ 文件写入失败: ${error}`);
        return {
          type: 'write' as const,
          path,
          result: null,
          timestamp,
          success: false,
          error
        };
      }
    );
  }

  async readFile(path: string): Promise<FsOperation> {
    const timestamp = Date.now();
    
    return executeOperation(
      async () => {
        this.addLog(`🔄 读取文件: ${path}`);
        const content = await this.client.readTextFile(path);
        this.addLog(`✅ 文件读取成功: ${path} (${content.length} 字符)`);
        return { content, length: content.length };
      },
      (result) => ({
        type: 'read' as const,
        path,
        result,
        timestamp,
        success: true
      }),
      (error) => {
        this.addLog(`❌ 文件读取失败: ${error}`);
        return {
          type: 'read' as const,
          path,
          result: null,
          timestamp,
          success: false,
          error
        };
      }
    );
  }
}

// Store Service
export class StoreService {
  constructor(private client: any, private addLog: (log: string) => void) {}

  async setValue(key: string, value: any): Promise<StoreOperation> {
    const timestamp = Date.now();
    
    return executeOperation(
      async () => {
        this.addLog(`🔄 设置值: ${key} = ${JSON.stringify(value)}`);
        await this.client.set(key, value);
        this.addLog(`✅ 值设置成功: ${key}`);
        return { success: true };
      },
      (result) => ({
        type: 'set' as const,
        key,
        value,
        result,
        timestamp,
        success: true
      }),
      (error) => {
        this.addLog(`❌ 设置值失败: ${error}`);
        return {
          type: 'set' as const,
          key,
          value,
          result: null,
          timestamp,
          success: false,
          error
        };
      }
    );
  }

  async getValue(key: string): Promise<StoreOperation> {
    const timestamp = Date.now();
    
    return executeOperation(
      async () => {
        this.addLog(`🔄 获取值: ${key}`);
        const value = await this.client.get(key);
        this.addLog(`✅ 获取值成功: ${key} = ${JSON.stringify(value)}`);
        return { value };
      },
      (result) => ({
        type: 'get' as const,
        key,
        result,
        timestamp,
        success: true
      }),
      (error) => {
        this.addLog(`❌ 获取值失败: ${error}`);
        return {
          type: 'get' as const,
          key,
          result: null,
          timestamp,
          success: false,
          error
        };
      }
    );
  }
}
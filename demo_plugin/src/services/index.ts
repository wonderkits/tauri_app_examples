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
  constructor(private client: any) {}

  async execute(sql: string): Promise<QueryResult> {
    const timestamp = Date.now();

    return executeOperation(
      async () => {
        let result: any;
        let type: 'select' | 'execute';

        if (sql.toLowerCase().startsWith('select')) {
          result = await this.client.select(sql);
          type = 'select';
        } else {
          result = await this.client.execute(sql);
          type = 'execute';
        }

        return { result, type };
      },
      ({ result, type }) => ({
        type,
        sql,
        result,
        timestamp,
        success: true,
      }),
      error => {
        return {
          type: 'execute' as const,
          sql,
          result: null,
          timestamp,
          success: false,
          error,
        };
      }
    );
  }
}

// FS Service
export class FsService {
  constructor(private client: any) {}

  async writeFile(path: string, content: string): Promise<FsOperation> {
    const timestamp = Date.now();

    return executeOperation(
      async () => {
        await this.client.writeTextFile(path, content);
        return { bytes: content.length };
      },
      result => ({
        type: 'write' as const,
        path,
        result,
        timestamp,
        success: true,
      }),
      error => {
        return {
          type: 'write' as const,
          path,
          result: null,
          timestamp,
          success: false,
          error,
        };
      }
    );
  }

  async readFile(path: string): Promise<FsOperation> {
    const timestamp = Date.now();

    return executeOperation(
      async () => {
        const content = await this.client.readTextFile(path);
        return { content, length: content.length };
      },
      result => ({
        type: 'read' as const,
        path,
        result,
        timestamp,
        success: true,
      }),
      error => {
        return {
          type: 'read' as const,
          path,
          result: null,
          timestamp,
          success: false,
          error,
        };
      }
    );
  }
}

// Store Service
export class StoreService {
  constructor(private client: any) {}

  async setValue(key: string, value: any): Promise<StoreOperation> {
    const timestamp = Date.now();

    return executeOperation(
      async () => {
        await this.client.set(key, value);
        return { success: true };
      },
      result => ({
        type: 'set' as const,
        key,
        value,
        result,
        timestamp,
        success: true,
      }),
      error => {
        return {
          type: 'set' as const,
          key,
          value,
          result: null,
          timestamp,
          success: false,
          error,
        };
      }
    );
  }

  async getValue(key: string): Promise<StoreOperation> {
    const timestamp = Date.now();

    return executeOperation(
      async () => {
        const value = await this.client.get(key);
        return { value };
      },
      result => ({
        type: 'get' as const,
        key,
        result,
        timestamp,
        success: true,
      }),
      error => {
        return {
          type: 'get' as const,
          key,
          result: null,
          timestamp,
          success: false,
          error,
        };
      }
    );
  }
}

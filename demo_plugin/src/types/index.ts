// 通用操作结果类型
export interface OperationResult<T = any> {
  type: string;
  success: boolean;
  result: T;
  timestamp: number;
  error?: string;
}

// SQL 相关类型
export interface QueryResult extends OperationResult {
  type: 'select' | 'execute';
  sql: string;
}

// 文件系统相关类型
export interface FsOperation extends OperationResult {
  type: 'read' | 'write' | 'mkdir' | 'stat' | 'exists' | 'readDir' | 'copy' | 'remove';
  path: string;
}

// 键值存储相关类型
export interface StoreOperation extends OperationResult {
  type: 'set' | 'get' | 'delete' | 'clear' | 'keys' | 'values' | 'entries' | 'length' | 'save';
  key?: string;
  value?: any;
}

// 操作模板类型
export interface OperationTemplate {
  name: string;
  action: () => void | Promise<void>;
}
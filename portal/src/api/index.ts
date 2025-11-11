// 统一导出所有 API 函数
export * from './config';
export * from './types';
export * from './users';
export * from './logs';
export * from './ai';

// 默认导出一个包含所有 API 的对象
import * as users from './users';
import * as logs from './logs';
import * as ai from './ai';

export default {
  users,
  logs,
  ai,
};

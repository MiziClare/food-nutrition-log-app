// API 类型定义

// 用户相关类型
export interface User {
  id: number;
  name?: string;
  email: string;
  password?: string; // 密码在响应中不会返回
}

export interface RegisterRequest {
  name?: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends User {
  // 后端返回的就是User对象，不包含token
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
}

// 食材相关类型
export interface FoodIngredient {
  id: number;
  logId: number;
  ingredientName: string; // 后端字段名
  kcal: number; // 后端字段名
  weight: number; // 后端返回BigDecimal，前端用number
}

// 日志相关类型
export interface FoodLog {
  id?: number;
  userId: number;
  imagePath: string; // 后端字段名
  confidence: number; // AI分析置信度 0-100
  user?: User; // 关联的用户信息
  ingredients?: FoodIngredient[]; // 食材列表
  createdAt?: string; // 创建时间（后端可能自动生成）
  updatedAt?: string; // 更新时间（后端可能自动生成）
}

export interface UploadResponse {
  status: 'SUCCESS' | 'FAILED';
  message?: string;
  logId?: number;
  count?: number; // 识别出的食材数量
  confidence?: number; // AI分析置信度
}

// AI Chat 相关类型
export interface ChatRequest {
  prompt: string;
  chatId: string;
}

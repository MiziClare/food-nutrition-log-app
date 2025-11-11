import { API_BASE_URL, defaultHeaders, handleResponse } from './config';
import type {
  User,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  UpdateUserRequest,
} from './types';

/**
 * 注册新用户
 */
export async function registerUser(data: RegisterRequest): Promise<User> {
  // 验证必填字段
  if (!data.email || !data.password) {
    console.error('Registration data validation failed:', {
      hasEmail: !!data.email,
      hasPassword: !!data.password,
      data: { ...data, password: data.password ? '***' : 'MISSING' }
    });
    throw new Error('Email and password are required');
  }

  console.log('registerUser called with:', {
    email: data.email,
    password: data.password ? `***${data.password.length} chars***` : 'MISSING!',
    name: data.name || 'not provided'
  });

  const bodyData = JSON.stringify(data);
  console.log('Request body string:', bodyData);

  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
    },
    body: bodyData,
  });

  return handleResponse<User>(response);
}

/**
 * 用户登录
 */
export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<LoginResponse>(response);
}

/**
 * 创建用户
 */
export async function createUser(data: RegisterRequest): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<User>(response);
}

/**
 * 根据邮箱获取用户
 */
export async function getUserByEmail(email: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users?email=${encodeURIComponent(email)}`, {
    method: 'GET',
    headers: defaultHeaders,
  });

  return handleResponse<User>(response);
}

/**
 * 根据 ID 获取用户
 */
export async function getUserById(userId: number): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers: defaultHeaders,
  });

  return handleResponse<User>(response);
}

/**
 * 更新用户信息
 */
export async function updateUser(userId: number, data: UpdateUserRequest): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<User>(response);
}

/**
 * 删除用户
 */
export async function deleteUser(userId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: defaultHeaders,
  });

  return handleResponse<void>(response);
}

import { API_BASE_URL, defaultHeaders, handleResponse } from './config';
import type { FoodLog } from './types';

/**
 * 根据 ID 获取单个日志（包含食材信息）
 */
export async function getLogById(logId: number): Promise<FoodLog> {
  const response = await fetch(`${API_BASE_URL}/logs/${logId}`, {
    method: 'GET',
    headers: defaultHeaders,
  });

  return handleResponse<FoodLog>(response);
}

/**
 * 获取用户的所有日志（路径参数方式）
 */
export async function getLogsByUserId(userId: number): Promise<FoodLog[]> {
  const response = await fetch(`${API_BASE_URL}/logs/user/${userId}`, {
    method: 'GET',
    headers: defaultHeaders,
  });

  return handleResponse<FoodLog[]>(response);
}

/**
 * 获取用户的所有日志（查询参数方式）
 */
export async function getLogsByUserIdQuery(userId: number): Promise<FoodLog[]> {
  const response = await fetch(`${API_BASE_URL}/logs?userId=${userId}`, {
    method: 'GET',
    headers: defaultHeaders,
  });

  return handleResponse<FoodLog[]>(response);
}

/**
 * 删除日志（同时删除其关联的食材）
 */
export async function deleteLog(logId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/logs/${logId}`, {
    method: 'DELETE',
    headers: defaultHeaders,
  });

  return handleResponse<void>(response);
}

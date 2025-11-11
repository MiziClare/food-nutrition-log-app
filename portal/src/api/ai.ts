import { API_BASE_URL, handleResponse } from './config';
import type { UploadResponse } from './types';

/**
 * 上传食物图片 -> 分析并记录食材
 */
export async function uploadFoodImage(
  file: File,
  userId: number,
  notes?: string
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId.toString());
  
  if (notes) {
    formData.append('notes', notes);
  }

  const response = await fetch(`${API_BASE_URL}/ai/agent/upload`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      // 注意：不要设置 Content-Type，让浏览器自动设置 multipart/form-data 的 boundary
    },
    body: formData,
  });

  return handleResponse<UploadResponse>(response);
}

/**
 * 测试 OpenAI API（聊天接口）
 */
export async function testChatApi(prompt: string, chatId: string): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/ai/chat?prompt=${encodeURIComponent(prompt)}&chatId=${encodeURIComponent(chatId)}`,
    {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
      },
    }
  );

  return handleResponse<string>(response);
}

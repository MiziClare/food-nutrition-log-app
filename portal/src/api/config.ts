// API 配置
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// 通用请求配置
export const defaultHeaders = {
  'Accept': 'application/json',
};

// 通用错误处理
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 通用响应处理
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status}`;
    let errorData: any = {};
    
    try {
      const text = await response.text();
      if (text) {
        // Try to parse as JSON first
        try {
          errorData = JSON.parse(text);
          errorMessage = errorData.message || errorData.error || text || errorMessage;
        } catch {
          // If not JSON, use the text directly
          errorMessage = text || errorMessage;
        }
      }
    } catch (e) {
      console.error('Error parsing error response:', e);
    }
    
    throw new ApiError(
      errorMessage,
      response.status,
      errorData
    );
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text() as Promise<T>;
}

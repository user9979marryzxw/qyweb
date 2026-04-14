import axios from 'axios';
import axiosRetry from 'axios-retry';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * Minimal ApiResponse 类型，供本文件使用以修复类型错误
 */
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
}

// Reuse api instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截，保留原逻辑并加上类型安全
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    const authValue = `Bearer ${token}`;
    if (typeof (config.headers as any)?.set === 'function') {
      (config.headers as any).set('Authorization', authValue);
    } else {
      (config.headers as any) = { ...(config.headers as any), Authorization: authValue };
    }
  }
  return config;
});

// 响应拦截：保持对 code !== 0 的处理，但不要调用 alert（在测试/Node 环境会出错）
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    if (response.data.code !== 0) {
      console.error(response.data.message);
      throw new Error(response.data.message);
    }
    return response;
  },
  (error) => {
    throw error;
  }
);

axiosRetry(api, {
  retries: 1,
  retryDelay: axiosRetry.exponentialDelay,
});

/**
 * Fetches application configuration.
 * 返回 ApiResponse 对象（因为测试中直接访问 result.data.version）
 */
export function getConfig(): Promise<ApiResponse<{ version: string; features: string[] }>> {
  return api.get<ApiResponse<{ version: string; features: string[] }>>('/common/config').then((res) => res.data);
}

/**
 * Submits feedback.
 */
export function submitFeedback(message: string): Promise<ApiResponse<{ id: number }>> {
  return api.post<ApiResponse<{ id: number }>>('/common/feedback', { message }).then((res) => res.data);
}

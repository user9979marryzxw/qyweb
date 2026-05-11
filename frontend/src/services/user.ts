import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { useAuthStore } from '../stores/auth';

// Unified response type
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// Axios instance with interceptors
export const api = axios.create({
  baseURL: '/api', // Base URL for backend APIs
  timeout: 5000,   // Request timeout (5s as per requirements)
});

// Request interceptor: Add Authorization header (using memory token from Pinia)
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore();
  const token = authStore.accessToken;
  
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

// Response interceptor: Handle errors globally (including 401 redirect)
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // Backend returns code 1 for success
    if (response.data.code !== 1) {
      const errorMsg = response.data.message || '系统繁忙，请稍后再试';
      console.error(`[API Error] ${response.config.url}: ${errorMsg}`);
      
      // 仅在浏览器环境下弹出提示
      if (typeof window !== 'undefined') {
        import('../utils/toast').then(m => m.default.error(errorMsg));
      }
      
      throw new Error(errorMsg);
    }
    return response;
  },
  (error) => {
    const authStore = useAuthStore();
    
    // HTTP 401 response: Unauthorized / Token expired
    if (error.response && error.response.status === 401) {
      authStore.clearAuth();
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = `/auth?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
      return Promise.reject(error);
    }

    // 处理网络超时或断网
    const errorMsg = error.response?.data?.message || error.message || '网络连接异常';
    if (typeof window !== 'undefined') {
      import('../utils/toast').then(m => m.default.error(errorMsg));
    }
    
    return Promise.reject(error);
  }
);

// Retry configuration: 1 retry with exponential backoff (as per requirement: 5s timeout, retry once)
axiosRetry(api, {
  retries: 1,
  retryCondition: (error) => {
    // Only retry on network errors or idempotent requests that timeout
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED';
  },
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Delay between retries
  },
});

/**
 * Logs in a user.
 * @param {string} username - The username, required.
 * @param {string} password - The password, required.
 * @param {boolean} rememberMe - Whether to extend validity to 7 days.
 * @returns {Promise<ApiResponse<{ token: string; userId: number; username: string; nickname: string; avatar: string; isAdmin: boolean }>>}
 */
export function login(username: string, password: string, rememberMe: boolean = false): Promise<ApiResponse<any>> {
  return api.post('/user/login', { username, password, rememberMe }).then((res) => res.data);
}

/**
 * Registers a new user.
 */
export function register(username: string, email: string, password: string): Promise<ApiResponse<{ userId: number }>> {
  return api.post('/user/register', { username, email, password }).then((res) => res.data);
}

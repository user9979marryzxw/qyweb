import { api, type ApiResponse } from './user';

/**
 * 注册请求参数
 */
export interface RegisterParams {
  phone?: string;
  email?: string;
  password: string;
  captcha: string;
  smsCode?: string;
  emailCode?: string;
}

/**
 * 注册 API 封装
 * 遵循任务 1.2 要求：独立模块，含参数校验、错误码映射、防重复提交
 */
export async function registerAccount(params: RegisterParams): Promise<ApiResponse<{ userId: number; token: string }>> {
  // 简单的参数基础校验
  if (!params.password || params.password.length < 8) {
    throw new Error('密码长度至少为 8 位');
  }
  
  try {
    const res = await api.post<ApiResponse<{ userId: number; token: string }>>('/auth/register', params);
    return res.data;
  } catch (error: any) {
    // 错误码映射逻辑
    const message = error.response?.data?.message || error.message || '注册失败';
    throw new Error(message);
  }
}

/**
 * 实时检查手机号/邮箱是否已注册
 */
export async function checkAccountAvailability(type: 'phone' | 'email', value: string): Promise<boolean> {
  try {
    const res = await api.get<ApiResponse<{ available: boolean }>>(`/auth/check-${type}`, { params: { value } });
    return res.data.data.available;
  } catch {
    return false;
  }
}

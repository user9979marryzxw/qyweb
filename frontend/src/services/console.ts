import { api, type ApiResponse } from './user';
import type { PageResult } from './product';

/**
 * 控制台统计数据
 */
export interface ConsoleStats {
  todaySales: string;
  pendingOrders: number;
  newUsers: number;
  stockAlerts: number;
  salesChange: string;
  ordersChange: string;
  usersChange: string;
  alertsStatus: string;
}

/**
 * 获取控制台概览统计
 */
export function getConsoleStats(): Promise<ApiResponse<ConsoleStats>> {
  return api.get<ApiResponse<ConsoleStats>>('/console/dashboard/stats').then(res => res.data);
}

/**
 * 获取控制台订单列表
 */
export function getConsoleOrders(params: {
  pageNo: number;
  pageSize: number;
  status?: string;
  search?: string;
}): Promise<ApiResponse<PageResult<any>>> {
  return api.get<ApiResponse<PageResult<any>>>('/console/orders', { params }).then(res => res.data);
}

/**
 * 获取控制台用户列表
 */
export function getConsoleUsers(params: {
  pageNo: number;
  pageSize: number;
  isAdmin?: boolean;
  search?: string;
}): Promise<ApiResponse<PageResult<any>>> {
  return api.get<ApiResponse<PageResult<any>>>('/console/users', { params }).then(res => res.data);
}

/**
 * 获取控制台日志列表
 */
export function getConsoleLogs(params: {
  pageNo: number;
  pageSize: number;
  type?: string;
  module?: string;
}): Promise<ApiResponse<PageResult<any>>> {
  return api.get<ApiResponse<PageResult<any>>>('/console/logs', { params }).then(res => res.data);
}

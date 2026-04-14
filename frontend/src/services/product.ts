import { api, type ApiResponse } from './user';

/**
 * 商品信息接口定义
 */
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  category: number;
  [key: string]: any;
}

/**
 * 分页响应接口定义
 */
export interface PageResult<T> {
  total: number;
  pages: number;
  list: T[];
}

/**
 * CDN 域名配置
 */
const CDN_HOST = 'https://cdn.qingyun-travel.com';

/**
 * 格式化图片 URL，支持 CDN 和 WebP
 */
export function formatImageUrl(url: string): string {
  if (!url) return '';
  // 如果已经是完整路径则返回
  if (url.startsWith('http')) return url;
  // 拼接 CDN 域名并添加 WebP 自适应参数（假设 CDN 支持 ?format=webp）
  return `${CDN_HOST}${url}${url.includes('?') ? '&' : '?'}format=webp`;
}

/**
 * 获取商品列表 (100% 对接后端分页接口)
 * 请求格式：GET /api/products?page=1&size=20&sort=price,desc&category=3
 */
export function getProducts(params: {
  page: number;
  size: number;
  sort?: string;
  category?: number;
  search?: string;
}): Promise<ApiResponse<PageResult<Product>>> {
  return api.get<ApiResponse<PageResult<Product>>>('/products', { 
    params,
    // 设置缓存控制（虽然 axios 默认不缓存，但明确标识逻辑）
    headers: { 'Cache-Control': 'no-cache' } 
  }).then((res) => {
    // 实时同步处理：可以在这里对数据进行初步处理
    if (res.data && res.data.data.list) {
      res.data.data.list = res.data.data.list.map(p => ({
        ...p,
        image: formatImageUrl(p.image)
      }));
    }
    return res.data;
  });
}

/**
 * 获取商品详情
 */
export function getProductDetail(id: number): Promise<ApiResponse<Product>> {
  return api.get<ApiResponse<Product>>(`/products/${id}`).then((res) => {
    if (res.data && res.data.data) {
      res.data.data.image = formatImageUrl(res.data.data.image);
    }
    return res.data;
  });
}

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProducts, formatImageUrl } from '../services/product'
import { api } from '../services/user'

// Mock api
vi.mock('../services/user', () => ({
  api: {
    get: vi.fn()
  }
}))

describe('Product Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('formatImageUrl 应正确处理 CDN 域名和 WebP', () => {
    const url = '/images/tour.jpg'
    const formatted = formatImageUrl(url)
    expect(formatted).toContain('https://cdn.qingyun-travel.com')
    expect(formatted).toContain('format=webp')
  })

  it('getProducts 应按后端规范发送分页参数', async () => {
    const mockResponse = {
      data: {
        code: 0,
        message: 'Success',
        data: {
          total: 100,
          pages: 5,
          list: [
            { id: 1, name: 'P1', image: '/img1.jpg', price: 100 }
          ]
        }
      }
    }
    
    // @ts-ignore
    api.get.mockResolvedValue(mockResponse)
    
    const params = { page: 1, size: 20, sort: 'price,desc', category: 3 }
    const result = await getProducts(params)
    
    expect(api.get).toHaveBeenCalledWith('/products', expect.objectContaining({
      params: params
    }))
    
    expect(result.data.total).toBe(100)
    // 检查图片 URL 是否已格式化
    expect(result.data.list[0].image).toContain('cdn.qingyun-travel.com')
  })

  it('接口超时或失败应抛出异常以便组件捕获', async () => {
    // @ts-ignore
    api.get.mockRejectedValue(new Error('Timeout'))
    
    await expect(getProducts({ page: 1, size: 10 })).rejects.toThrow('Timeout')
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePaginationStore } from '../stores/pagination'

describe('Pagination Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('应该能正确存储并获取缓存数据', () => {
    const store = usePaginationStore()
    const category = 'domestic'
    const queryParams = { pageNo: 1, pageSize: 12 }
    const mockData = { list: [], total: 0 }

    store.setCache(category, queryParams, mockData)
    const cached = store.getFromCache(category, queryParams)
    
    expect(cached).toEqual(mockData)
  })

  it('缓存过期 (TTL) 后应该返回 null', async () => {
    const store = usePaginationStore()
    const category = 'domestic'
    const queryParams = { pageNo: 1 }
    const mockData = { list: [] }

    // 模拟存入一个已过期的项
    // @ts-ignore
    store.cache.set('domestic_{"pageNo":1}', {
      data: mockData,
      timestamp: Date.now() - 6 * 60 * 1000 // 6 minutes ago (TTL is 5min)
    })

    const cached = store.getFromCache(category, queryParams)
    expect(cached).toBeNull()
  })

  it('超过最大容量 (50) 时应该执行 LRU 淘汰', () => {
    const store = usePaginationStore()
    const category = 'test'
    
    // 存入 51 条数据
    for (let i = 0; i < 51; i++) {
      store.setCache(category, { id: i }, { val: i })
    }

    // 第一条数据应该被淘汰了
    expect(store.getFromCache(category, { id: 0 })).toBeNull()
    // 最后一条数据应该还在
    expect(store.getFromCache(category, { id: 50 })).toEqual({ val: 50 })
  })

  it('命中缓存时应该更新其在 LRU 中的位置', () => {
    const store = usePaginationStore()
    
    store.setCache('cat', { id: 1 }, { v: 1 })
    store.setCache('cat', { id: 2 }, { v: 2 })
    
    // 访问 id:1，使其变为“最新”
    store.getFromCache('cat', { id: 1 })
    
    // 手动检查 Map 顺序 (Map 的迭代顺序即为插入顺序)
    // @ts-ignore
    const keys = Array.from(store.cache.keys())
    expect(keys[keys.length - 1]).toContain('"id":1')
  })
})

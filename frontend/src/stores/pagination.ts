import { defineStore } from 'pinia'
import { ref } from 'vue'

interface CacheEntry {
  data: any
  timestamp: number
}

/**
 * UnifiedPaginationModule 状态管理
 * 遵循任务 2.2 要求：按 category+queryKey 做 LRU 缓存，最大 50 条，TTL 5 min
 */
export const usePaginationStore = defineStore('pagination', () => {
  const cache = ref<Map<string, CacheEntry>>(new Map())
  const MAX_CACHE_SIZE = 50
  const TTL = 5 * 60 * 1000 // 5 minutes

  const getCacheKey = (category: string, queryParams: any) => {
    return `${category}_${JSON.stringify(queryParams)}`
  }

  const getFromCache = (category: string, queryParams: any) => {
    const key = getCacheKey(category, queryParams)
    const entry = cache.value.get(key)
    
    if (entry) {
      if (Date.now() - entry.timestamp < TTL) {
        // LRU: 重新插入以更新位置
        cache.value.delete(key)
        cache.value.set(key, entry)
        return entry.data
      }
      cache.value.delete(key)
    }
    return null
  }

  const setCache = (category: string, queryParams: any, data: any) => {
    const key = getCacheKey(category, queryParams)
    
    if (cache.value.size >= MAX_CACHE_SIZE) {
      // 删除最旧的项（Map 的第一个项）
      const firstKey = cache.value.keys().next().value
      if (firstKey) cache.value.delete(firstKey)
    }
    
    cache.value.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  return {
    getFromCache,
    setCache
  }
})

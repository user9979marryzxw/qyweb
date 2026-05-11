<script setup lang="ts" generic="T">
import { ref, onMounted, watch } from 'vue'
import { RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { usePaginationStore } from '../stores/pagination'
import { api } from '../services/user'

/**
 * UnifiedPaginationModule 通用分页组件
 * 遵循任务 2.2 要求：统一请求参数、响应模型、加载/空/错误态 UI
 */

interface PagingParams {
  pageNo: number
  pageSize: number
  category: string
  destination?: string
  priceRange?: [number, number]
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  filterTags?: string[]
}

interface PagingResponse<T> {
  list: T[]
  total: number
  pages: number
  current: number
}

const props = defineProps<{
  category: string
  pageSize?: number
  fetchUrl: string
  queryParams?: Partial<PagingParams>
}>()

const emit = defineEmits<{
  (e: 'update:data', list: T[]): void
  (e: 'paging', info: { module: string, pageNo: number, pageSize: number, itemCount: number }): void
}>()

defineSlots<{
  default(props: { list: T[] }): any
}>()

const paginationStore = usePaginationStore()
const currentPage = ref(1)
const totalItems = ref(0)
const totalPages = ref(0)
const dataList = ref<T[]>([]) as any
const isLoading = ref(false)
const isError = ref(false)

// 数据抓取逻辑
const fetchData = async (pageNo = 1) => {
  const query = {
    pageNo,
    pageSize: props.pageSize || 12,
    category: props.category,
    ...props.queryParams
  }

  // 1. 尝试从缓存获取 (TTL 5 min, LRU)
  const cachedData = paginationStore.getFromCache(props.category, query)
  if (cachedData) {
    updateState(cachedData)
    return
  }

  // 2. 发起请求
  isLoading.value = true
  isError.value = false
  
  const startTime = performance.now()
  try {
    const res = await api.get<PagingResponse<T>>(props.fetchUrl, { params: query })
    const data = res.data as unknown as PagingResponse<T>
    
    updateState(data)
    paginationStore.setCache(props.category, query, data)
    
    // 性能监控埋点
    const endTime = performance.now()
    console.log(`[UnifiedPagination] Render time: ${endTime - startTime}ms`)
    
    // 业务埋点
    emit('paging', {
      module: props.category,
      pageNo: data.current,
      pageSize: props.pageSize || 12,
      itemCount: data.list.length
    })
  } catch (error) {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

const updateState = (data: PagingResponse<T>) => {
  dataList.value = data.list
  totalItems.value = data.total
  totalPages.value = data.pages
  currentPage.value = data.current
  emit('update:data', data.list)
}

const handlePageChange = (pageNo: number) => {
  if (pageNo < 1 || pageNo > totalPages.value) return
  fetchData(pageNo)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听查询参数变化
watch(() => props.queryParams, () => {
  fetchData(1)
}, { deep: true })

onMounted(() => {
  fetchData(1)
})

defineExpose({
  refresh: () => fetchData(currentPage.value),
  reset: () => fetchData(1)
})
</script>

<template>
  <div class="unified-pagination w-full">
    <!-- Slot for rendering list -->
    <div class="relative min-h-[400px]">
      <div v-if="isLoading" class="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
        <div class="flex flex-col items-center space-y-4">
          <div class="relative">
            <div class="w-12 h-12 border-4 border-brand-green/10 rounded-full"></div>
            <div class="absolute top-0 left-0 w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
          </div>
          <span class="text-xs font-bold text-brand-green tracking-widest uppercase opacity-40">加载中...</span>
        </div>
      </div>

      <div v-if="isError" class="flex flex-col items-center justify-center py-24 space-y-6">
        <div class="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center">
          <AlertCircle class="w-10 h-10" />
        </div>
        <div class="text-center">
          <h3 class="text-lg font-bold text-gray-900 mb-1">加载失败</h3>
          <p class="text-xs text-brand-slate opacity-40">由于网络波动，无法获取商品信息</p>
        </div>
        <button @click="fetchData(currentPage)" class="group bg-brand-green text-white py-3 px-8 rounded-2xl text-xs font-bold shadow-lg shadow-brand-green/20 hover:bg-brand-green/90 transition-all flex items-center space-x-2">
          <RefreshCw class="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span>点击重试</span>
        </button>
      </div>

      <div v-else-if="!isLoading && dataList.length === 0" class="flex flex-col items-center justify-center py-24 space-y-4">
        <div class="w-20 h-20 bg-gray-50 text-brand-slate opacity-10 rounded-3xl flex items-center justify-center">
          <AlertCircle class="w-10 h-10" />
        </div>
        <p class="text-xs font-bold text-brand-slate opacity-30 tracking-widest uppercase">暂无相关商品</p>
      </div>

      <div v-else class="animate-in fade-in duration-700">
        <slot :list="dataList"></slot>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="mt-16 flex items-center justify-center space-x-2">
      <button 
        @click="handlePageChange(currentPage - 1)"
        :disabled="currentPage === 1"
        class="p-3 rounded-xl border border-gray-100 bg-white text-brand-slate hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>

      <div class="flex items-center space-x-1">
        <button 
          v-for="p in totalPages" 
          :key="p"
          @click="handlePageChange(p)"
          class="w-10 h-10 rounded-xl text-xs font-bold transition-all"
          :class="currentPage === p ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'bg-white text-brand-slate border border-gray-100 hover:bg-gray-50'"
        >
          {{ p }}
        </button>
      </div>

      <button 
        @click="handlePageChange(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="p-3 rounded-xl border border-gray-100 bg-white text-brand-slate hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

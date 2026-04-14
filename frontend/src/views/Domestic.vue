<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Filter, Search, RefreshCw, AlertCircle } from 'lucide-vue-next'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ProductCard from '@/components/ProductCard.vue'
import { getProducts, type Product } from '@/services/product'
import toast from '@/utils/toast'

gsap.registerPlugin(ScrollTrigger)

const activeFilter = ref('全部')
const filters = ['全部', '川藏', '云南', '海南', '西北', '江浙沪']
const searchQuery = ref('')

// 状态管理
const products = ref<Product[]>([])
const isLoading = ref(false)
const isError = ref(false)
const page = ref(1)
const pageSize = ref(8)
const total = ref(0)
const hasMore = ref(true)

/**
 * 获取数据函数
 */
const fetchData = async (isRefresh = false) => {
  if (isRefresh) {
    page.value = 1
    products.value = []
    hasMore.value = true
  }
  
  if (!hasMore.value || isLoading.value) return

  isLoading.value = true
  isError.value = false
  
  try {
    const res = await getProducts({
      page: page.value,
      size: pageSize.value,
      category: activeFilter.value === '全部' ? undefined : 1, // 假设 1 是国内游
      search: searchQuery.value || undefined
    })
    
    if (res.data && res.data.list) {
      if (isRefresh) {
        products.value = res.data.list
      } else {
        products.value.push(...res.data.list)
      }
      total.value = res.data.total
      hasMore.value = products.value.length < total.value
      page.value++
    }
  } catch (error) {
    isError.value = true
    toast.error('获取商品列表失败，请稍后重试')
  } finally {
    isLoading.value = false
    // 触发动画
    setTimeout(() => {
      gsap.from('.product-grid > .new-item', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
      })
    }, 100)
  }
}

// 监听筛选器变化
watch(activeFilter, () => {
  fetchData(true)
})

// 无限滚动监听
const handleScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight
  
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    fetchData()
  }
}

onMounted(() => {
  fetchData(true)
  window.addEventListener('scroll', handleScroll)
  
  gsap.from('.banner-content', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="min-h-screen bg-[#F9FAFB]">
    <Header />

    <!-- Banner -->
    <section class="relative h-[40vh] overflow-hidden">
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="absolute inset-0 flex flex-col items-center justify-center text-white banner-content">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 tracking-tight">国内游</h1>
        <p class="text-lg opacity-90">发现身边的绝美秘境</p>
      </div>
    </section>

    <!-- Filters & Search -->
    <section class="bg-white border-b border-gray-100 sticky top-[72px] z-40">
      <div class="max-w-7xl mx-auto px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button 
            v-for="filter in filters" 
            :key="filter"
            @click="activeFilter = filter"
            class="px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
            :class="activeFilter === filter ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'text-brand-slate hover:bg-gray-50'"
          >
            {{ filter }}
          </button>
        </div>
        
        <div class="relative w-full md:w-80">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-slate opacity-40" />
          <input 
            v-model="searchQuery"
            @keyup.enter="fetchData(true)"
            type="text" 
            placeholder="搜索目的地或关键词" 
            class="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green transition-all"
          />
        </div>
      </div>
    </section>

    <!-- Product Grid -->
    <main class="max-w-7xl mx-auto px-8 py-16">
      <div v-if="isError" class="flex flex-col items-center justify-center py-24 space-y-6">
        <div class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <AlertCircle class="w-10 h-10" />
        </div>
        <div class="text-center">
          <h3 class="text-xl font-bold text-gray-900 mb-2">服务暂时不可用</h3>
          <p class="text-brand-slate">别担心，这可能只是网络波动</p>
        </div>
        <button @click="fetchData(true)" class="bg-brand-green text-white py-3 px-10 rounded-full font-bold shadow-xl shadow-brand-green/20 hover:bg-brand-green/90 transition-all flex items-center space-x-2">
          <RefreshCw class="w-4 h-4" />
          <span>点击刷新重试</span>
        </button>
      </div>

      <div v-else class="product-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Skeleton Screen -->
        <template v-if="isLoading && products.length === 0">
          <div v-for="i in 8" :key="i" class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
            <div class="aspect-[4/3] bg-gray-100"></div>
            <div class="p-6 space-y-4">
              <div class="h-4 bg-gray-100 rounded w-1/3"></div>
              <div class="h-6 bg-gray-100 rounded w-3/4"></div>
              <div class="h-4 bg-gray-100 rounded w-full"></div>
              <div class="flex justify-between items-center pt-4">
                <div class="h-6 bg-gray-100 rounded w-1/4"></div>
                <div class="h-10 bg-gray-100 rounded-xl w-1/3"></div>
              </div>
            </div>
          </div>
        </template>

        <!-- Product Cards -->
        <ProductCard 
          v-for="product in products" 
          :key="product.id"
          class="new-item"
          :id="product.id"
          :category="product.category_name || '国内游'"
          :title="product.name"
          :description="product.description"
          :price="product.price"
          :image="product.image"
          :rating="product.rating || 5.0"
        />
      </div>

      <!-- Load More / Empty State -->
      <div class="mt-16 flex justify-center">
        <div v-if="isLoading && products.length > 0" class="flex items-center space-x-3 text-brand-green font-bold">
          <RefreshCw class="w-5 h-5 animate-spin" />
          <span>正在为您加载更多精彩...</span>
        </div>
        <div v-else-if="!hasMore && products.length > 0" class="text-brand-slate opacity-30 font-bold uppercase tracking-widest text-xs">
          已经到达探索的边界
        </div>
        <div v-else-if="!isLoading && products.length === 0" class="text-center py-12">
          <p class="text-brand-slate font-medium">暂时没有找到符合条件的商品</p>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

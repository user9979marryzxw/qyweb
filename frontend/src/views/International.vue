<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Search, MapPin, Compass } from 'lucide-vue-next'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ProductCard from '@/components/ProductCard.vue'

gsap.registerPlugin(ScrollTrigger)

const loading = ref(false)
const error = ref(false)
const activeFilter = ref('全部')
const filters = ['全部', '欧洲', '东南亚', '北美', '澳洲', '中东']

const products = ref([
  {
    id: 10,
    category: '出境游',
    rating: 5.0,
    title: '瑞士阿尔卑斯 · 雪山之巅 10 日深度游',
    description: '冰川列车、奢华木屋、米其林餐饮体验',
    price: 35800,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800'
  },
  {
    id: 11,
    category: '出境游',
    rating: 4.9,
    title: '泰国清迈 · 兰纳王朝 6 日佛系旅程',
    description: '大象营、古城漫步、奢华安纳塔拉度假体验',
    price: 8800,
    image: 'https://images.unsplash.com/photo-1528181304800-2f140819898f?q=80&w=800'
  },
  {
    id: 12,
    category: '出境游',
    rating: 4.9,
    title: '日本京都 · 禅意秋色 7 日赏枫之约',
    description: '怀石料理、私人汤泉、千年寺院沉浸式体验',
    price: 22800,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800'
  }
])

onMounted(() => {
  gsap.from('.banner-content', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })

  gsap.from('.product-grid > *', {
    scrollTrigger: {
      trigger: '.product-grid',
      start: 'top 80%'
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out'
  })
})
</script>

<template>
  <div class="min-h-screen">
    <Header />

    <!-- Banner -->
    <section class="relative h-[40vh] overflow-hidden">
      <img src="https://images.unsplash.com/photo-1436491865332-7a61a109c055?q=80&w=2000" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="absolute inset-0 flex flex-col items-center justify-center text-white banner-content">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 tracking-tight">出境游</h1>
        <p class="text-lg opacity-90">横跨大洋，连接世界</p>
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
        <div class="relative w-full md:w-64">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-slate opacity-50" />
          <input type="text" placeholder="搜索全球目的地..." class="w-full bg-gray-50 border border-gray-100 rounded-full px-10 py-2.5 text-sm focus:outline-none focus:border-brand-green transition-all" />
        </div>
      </div>
    </section>

    <!-- Content -->
    <main class="max-w-7xl mx-auto px-8 py-16">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
        <div class="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
        <p class="text-brand-slate text-sm">正在探索世界目的地...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-20 space-y-6">
        <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <Compass class="w-10 h-10 text-red-500 opacity-50" />
        </div>
        <div class="text-center">
          <h3 class="text-lg font-bold text-gray-900 mb-2">信号开小差了</h3>
          <p class="text-sm text-brand-slate">我们暂时无法获取最新的出境游信息，请稍后再试。</p>
        </div>
        <button @click="loading = true; error = false" class="btn-outline">重新尝试</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="flex flex-col items-center justify-center py-20 space-y-6">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
          <MapPin class="w-10 h-10 text-gray-300" />
        </div>
        <div class="text-center">
          <h3 class="text-lg font-bold text-gray-900 mb-2">未找到目的地</h3>
          <p class="text-sm text-brand-slate">抱歉，当前筛选条件下暂无合适的产品，换个目的地试试吧。</p>
        </div>
      </div>

      <!-- Product List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 product-grid">
        <ProductCard v-for="product in products" :key="product.id" v-bind="product" />
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

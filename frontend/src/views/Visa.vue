<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { Search, ShieldCheck, Zap, Globe, Clock } from 'lucide-vue-next'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ProductCard from '@/components/ProductCard.vue'
import UnifiedPaginationModule from '@/components/UnifiedPaginationModule.vue'

const activeFilter = ref('热门')
const filters = ['热门', '亚洲', '欧洲', '美洲', '大洋洲', '非洲']
const searchQuery = ref('')

const queryParams = ref({
  destination: activeFilter.value === '热门' ? undefined : activeFilter.value,
  search: searchQuery.value
})

const handleFilterChange = (filter: string) => {
  activeFilter.value = filter
  queryParams.value = {
    ...queryParams.value,
    destination: filter === '热门' ? undefined : filter
  }
}

const handleSearch = () => {
  queryParams.value = {
    ...queryParams.value,
    search: searchQuery.value
  }
}

onMounted(() => {
  gsap.from('.banner-content', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })
})
</script>

<template>
  <div class="min-h-screen bg-[#F9FAFB]">
    <Header />

    <!-- Banner -->
    <section class="relative h-[45vh] overflow-hidden">
      <img src="https://images.unsplash.com/photo-1436491865332-7a61a109c055?q=80&w=2000" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="absolute inset-0 flex flex-col items-center justify-center text-white banner-content">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 tracking-tight">全球签证服务</h1>
        <p class="text-lg opacity-90">专业、极速、省心，让您的世界之行触手可及</p>
      </div>
    </section>

    <!-- Features -->
    <section class="bg-white border-b border-gray-100 py-12">
      <div class="max-w-7xl mx-auto px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-brand-green/5 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck class="w-6 h-6 text-brand-green" />
            </div>
            <div>
              <h4 class="font-bold text-sm">官方认证</h4>
              <p class="text-xs text-brand-slate mt-1">多年行业资质积累</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-brand-green/5 rounded-2xl flex items-center justify-center shrink-0">
              <Zap class="w-6 h-6 text-brand-green" />
            </div>
            <div>
              <h4 class="font-bold text-sm">极速办理</h4>
              <p class="text-xs text-brand-slate mt-1">最快 24 小时出签</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-brand-green/5 rounded-2xl flex items-center justify-center shrink-0">
              <Globe class="w-6 h-6 text-brand-green" />
            </div>
            <div>
              <h4 class="font-bold text-sm">全球覆盖</h4>
              <p class="text-xs text-brand-slate mt-1">支持 150+ 国家签证</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-brand-green/5 rounded-2xl flex items-center justify-center shrink-0">
              <Clock class="w-6 h-6 text-brand-green" />
            </div>
            <div>
              <h4 class="font-bold text-sm">全程跟踪</h4>
              <p class="text-xs text-brand-slate mt-1">进度实时短信提醒</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters & Search -->
    <section class="bg-white border-b border-gray-100 sticky top-[72px] z-40">
      <div class="max-w-7xl mx-auto px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button 
            v-for="filter in filters" 
            :key="filter"
            @click="handleFilterChange(filter)"
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
            @keyup.enter="handleSearch"
            type="text" 
            placeholder="搜索国家或签证类型" 
            class="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green transition-all"
          />
        </div>
      </div>
    </section>

    <!-- Visa Products Grid with UnifiedPaginationModule -->
    <main class="max-w-7xl mx-auto px-8 py-16">
      <UnifiedPaginationModule 
        category="visa"
        fetchUrl="/products"
        :pageSize="12"
        :queryParams="queryParams"
      >
        <template #default="{ list }: { list: any[] }">
          <div class="product-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ProductCard 
              v-for="product in list" 
              :key="product.id"
              class="new-item"
              :id="product.id"
              :category="product.category_name || '签证服务'"
              :title="product.name"
              :description="product.description"
              :price="product.price"
              :image="product.image"
              :rating="product.rating || 5.0"
            />
          </div>
        </template>
      </UnifiedPaginationModule>
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Search, ShieldCheck, Zap, Globe, Clock, ArrowRight } from 'lucide-vue-next'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ProductCard from '@/components/ProductCard.vue'

gsap.registerPlugin(ScrollTrigger)

const activeFilter = ref('热门')
const filters = ['热门', '亚洲', '欧洲', '美洲', '大洋洲', '非洲']

const visaProducts = [
  {
    id: 20,
    category: '签证服务',
    rating: 4.9,
    title: '日本个人旅游签证 · 极简材料',
    description: '专业文案 1对1 指导，最快 5 个工作日出签，高通过率保障。',
    price: 399,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800'
  },
  {
    id: 21,
    category: '签证服务',
    rating: 5.0,
    title: '欧洲申根签证 · 法国/德国/意大利',
    description: '含行程单/保险/酒店预订单，专业陪签服务，省心之选。',
    price: 1280,
    image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=800'
  },
  {
    id: 22,
    category: '签证服务',
    rating: 4.8,
    title: '美国 B1/B2 签证 · 面签培训',
    description: '资深顾问模拟面试，材料深度挖掘，提升获签机率。',
    price: 1580,
    image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=800'
  },
  {
    id: 23,
    category: '签证服务',
    rating: 4.9,
    title: '澳洲电子签证 · 极速出签',
    description: '无需寄送护照，在线提交材料，专业审核，极速反馈。',
    price: 880,
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=800'
  }
]

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
              <p class="text-xs text-brand-slate mt-1">专业团队高效审理</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-brand-green/5 rounded-2xl flex items-center justify-center shrink-0">
              <Globe class="w-6 h-6 text-brand-green" />
            </div>
            <div>
              <h4 class="font-bold text-sm">全球覆盖</h4>
              <p class="text-xs text-brand-slate mt-1">支持 100+ 国家签证</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-brand-green/5 rounded-2xl flex items-center justify-center shrink-0">
              <Clock class="w-6 h-6 text-brand-green" />
            </div>
            <div>
              <h4 class="font-bold text-sm">实时进度</h4>
              <p class="text-xs text-brand-slate mt-1">全程掌握签证状态</p>
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
            @click="activeFilter = filter"
            class="px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
            :class="activeFilter === filter ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'text-brand-slate hover:bg-gray-50'"
          >
            {{ filter }}
          </button>
        </div>
        <div class="relative w-full md:w-64">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-slate opacity-50" />
          <input type="text" placeholder="搜索目的地国家..." class="w-full bg-gray-50 border border-gray-100 rounded-full px-10 py-2.5 text-sm focus:outline-none focus:border-brand-green transition-all" />
        </div>
      </div>
    </section>

    <!-- Product List -->
    <main class="max-w-7xl mx-auto px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 product-grid">
        <ProductCard v-for="product in visaProducts" :key="product.id" v-bind="product" />
      </div>

      <!-- Pagination (Mock) -->
      <div class="mt-20 flex justify-center items-center space-x-4">
        <button class="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30" disabled>
          <ArrowRight class="w-4 h-4 rotate-180" />
        </button>
        <div class="flex items-center space-x-2">
          <button class="w-10 h-10 rounded-xl bg-brand-green text-white font-bold text-sm shadow-lg shadow-brand-green/20">1</button>
          <button class="w-10 h-10 rounded-xl hover:bg-gray-50 text-sm font-medium transition-colors">2</button>
        </div>
        <button class="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ArrowRight class="w-4 h-4" />
        </button>
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

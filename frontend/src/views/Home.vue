<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Globe, Compass, CreditCard } from 'lucide-vue-next'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ProductCard from '@/components/ProductCard.vue'

// 注册 GSAP 的滚动插件，用于实现页面滚动时的入场动画
gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const heroRef = ref(null)

// 轮播图数据 (模拟 /api/banner/goods 接口返回)
const slides = ref([
  {
    goodsId: '1',
    goodsName: '探索未知的边界',
    discountTag: '限时 8 折',
    bannerImgUrl: 'https://images.unsplash.com/photo-1506929113670-8730997782a1?q=80&w=2000&auto=format&fit=crop',
    weight: 10
  },
  {
    goodsId: '2',
    goodsName: '重塑生活的艺术',
    discountTag: '高端定制',
    bannerImgUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop',
    weight: 20
  }
])

// 按权重倒序排序
const sortedSlides = computed(() => {
  return [...slides.value].sort((a, b) => b.weight - a.weight)
})

const products = [
  {
    id: 1,
    category: '国内游',
    rating: 4.9,
    title: '川西秘境 · 稻城亚丁 8 日奢享游',
    description: '私人向导、顶级度假酒店、沉浸式藏文化体验',
    price: 12800,
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800'
  },
  {
    id: 2,
    category: '出境游',
    rating: 5.0,
    title: '瑞士阿尔卑斯 · 雪山之巅 10 日深度游',
    description: '冰川列车、奢华木屋、米其林餐饮体验',
    price: 35800,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800'
  },
  {
    id: 3,
    category: '签证',
    rating: 4.8,
    title: '欧洲申根签证 · 极速极简代办',
    description: '专业文案指导、极速响应、高通过率保证',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c055?q=80&w=800'
  }
]

const currentSlide = ref(0)

const handleBannerClick = (slide: any) => {
  if (!slide.goodsId) {
    console.error('Track: banner_error', { error: 'goodsId is empty' })
    return
  }
  console.log('Track: bannerClick', { goodsId: slide.goodsId })
  router.push(`/product/${slide.goodsId}`)
}

onMounted(() => {
  // 首页 Hero 区域的进场动画
  gsap.from('.hero-content', {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out'
  })

  // 滚动区域的渐进式动效
  const sections = document.querySelectorAll('.scroll-section')
  sections.forEach((section) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  })
})

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % sortedSlides.value.length
}
</script>

<template>
  <div class="min-h-screen">
    <Header />

    <!-- Hero Slider -->
    <section ref="heroRef" class="relative h-[90vh] overflow-hidden">
      <div 
        v-for="(slide, index) in sortedSlides" 
        :key="index"
        class="absolute inset-0 transition-opacity duration-1000"
        :class="index === currentSlide ? 'opacity-100' : 'opacity-0'"
      >
        <img :src="slide.bannerImgUrl" :alt="slide.goodsName" class="w-full h-full object-cover scale-105" />
        <div class="absolute inset-0 bg-black/30"></div>
        <div class="absolute inset-0 flex flex-col items-center justify-center text-white px-4 hero-content">
          <h1 class="text-5xl md:text-7xl font-bold mb-6 text-center tracking-tight">{{ slide.goodsName }}</h1>
          <p class="text-lg md:text-xl max-w-2xl text-center opacity-90 mb-10 leading-relaxed">{{ slide.discountTag }}</p>
          <button @click="handleBannerClick(slide)" class="group flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-full hover:bg-white hover:text-brand-green transition-all duration-300">
            <span>探索更多</span>
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <!-- Capsule Indicators -->
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-3 z-30">
        <button 
          v-for="(_, index) in sortedSlides" 
          :key="index"
          @click="currentSlide = index"
          class="h-1.5 rounded-full transition-all duration-500"
          :class="index === currentSlide ? 'w-6 bg-white shadow-lg' : 'w-2 bg-white/40 hover:bg-white/60'"
        ></button>
      </div>
    </section>

    <!-- Categories -->
    <section class="max-w-7xl mx-auto px-8 py-24 scroll-section">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <router-link to="/custom-domestic" class="card-premium p-8 flex flex-col items-center text-center group">
          <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-green/5 transition-colors">
            <Compass class="w-8 h-8 text-brand-green" />
          </div>
          <h3 class="text-xl font-semibold mb-3">国内定制</h3>
          <p class="text-brand-slate text-sm leading-relaxed">深入大好河山，挖掘隐藏的绝美秘境，享受纯正的人文风情。</p>
        </router-link>
        <router-link to="/global-tour" class="card-premium p-8 flex flex-col items-center text-center group">
          <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-green/5 transition-colors">
            <Globe class="w-8 h-8 text-brand-green" />
          </div>
          <h3 class="text-xl font-semibold mb-3">全球环游</h3>
          <p class="text-brand-slate text-sm leading-relaxed">跨越国界，连接世界，为您开启一场非同凡响的跨国之旅。</p>
        </router-link>
        <router-link to="/visa" class="card-premium p-8 flex flex-col items-center text-center group">
          <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-green/5 transition-colors">
            <CreditCard class="w-8 h-8 text-brand-green" />
          </div>
          <h3 class="text-xl font-semibold mb-3">快捷签证</h3>
          <p class="text-brand-slate text-sm leading-relaxed">极速响应，专业服务，让繁琐的签证流程变得轻而易举。</p>
        </router-link>
      </div>
    </section>

    <!-- Products -->
    <section class="bg-gray-50 py-24 px-8 scroll-section">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-end justify-between mb-12">
          <div>
            <h2 class="text-3xl font-bold mb-4">精选目的地</h2>
            <p class="text-brand-slate">为您精心挑选的高端旅行套餐</p>
          </div>
          <router-link to="/domestic" class="text-brand-green font-medium flex items-center space-x-1 hover:underline">
            <span>查看全部</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <ProductCard v-for="product in products" :key="product.id" v-bind="product" />
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<style scoped>
.hero-content h1 {
  text-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>

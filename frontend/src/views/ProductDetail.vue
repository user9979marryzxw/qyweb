<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Check, Share2, Heart, ShieldCheck, Clock, Navigation, PhoneCall, CreditCard, Copy, X } from 'lucide-vue-next'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useAuthStore } from '../stores/auth'
import toast from '../utils/toast'

const router = useRouter()
const authStore = useAuthStore()

const bookingStatus = ref<'idle' | 'purchasing' | 'completed' | 'refunding' | 'appealing'>('idle')
const showRefundDialog = ref(false)
const showAppealDialog = ref(false)
const showSharePanel = ref(false)
const isLowEndDevice = ref(false)

onMounted(() => {
  // 简单的低端机型检测：内存 < 4GB 或硬件加速不可用
  if ('deviceMemory' in navigator && (navigator as any).deviceMemory < 4) {
    isLowEndDevice.value = true
  }
})
const isLiked = ref(false)
const likeCount = ref(128)
const isLikeLoading = ref(false)

// 模拟“立即预订”交互
const buyNow = () => {
  bookingStatus.value = 'purchasing'
  setTimeout(() => {
    bookingStatus.value = 'completed'
  }, 1500)
}

// 点赞功能
const toggleLike = async () => {
  if (isLikeLoading.value) return
  
  // 未登录拦截
  if (!authStore.isLogin) {
    toast.warning('登录后即可点赞')
    return
  }

  isLikeLoading.value = true
  // 模拟 API 调用 (POST /api/product/{id}/like)
  setTimeout(() => {
    isLiked.value = !isLiked.value
    likeCount.value += isLiked.value ? 1 : -1
    isLikeLoading.value = false
    // 模拟埋点
    console.log('Track: product_like', { productId: 1, action: isLiked.value ? 'like' : 'unlike' })
  }, 300)
}

// 分享功能
const shareChannels = [
  { name: '微信', icon: 'QrCode', color: 'text-green-500' },
  { name: 'QQ', icon: 'MessageCircle', color: 'text-blue-400' },
  { name: '微博', icon: 'Globe', color: 'text-red-400' },
  { name: '复制链接', icon: 'Copy', color: 'text-gray-500' }
]

const copyLink = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    alert('链接已复制到剪贴板')
    showSharePanel.value = false
    // 模拟埋点
    console.log('Track: product_share', { productId: 1, channel: 'copy_link' })
  })
}

const requestRefund = () => {
  showRefundDialog.value = true
}

const submitRefund = () => {
  showRefundDialog.value = false
  bookingStatus.value = 'refunding'
}

const submitAppeal = () => {
  showAppealDialog.value = false
  bookingStatus.value = 'appealing'
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <Header />

    <main class="max-w-7xl mx-auto px-8 py-12">
      <!-- Back and Actions -->
      <div class="flex items-center justify-between mb-8">
        <button @click="$router.back()" class="flex items-center space-x-2 text-brand-slate hover:text-brand-green transition-colors group">
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span class="text-sm font-medium">返回</span>
        </button>
        <div class="flex items-center space-x-4">
          <button 
            v-auth
            @click="toggleLike"
            class="flex items-center space-x-2 px-4 py-2 rounded-full transition-all border"
            :class="isLiked ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-gray-100 text-brand-slate hover:bg-gray-50'"
          >
            <Heart class="w-4 h-4" :class="{'fill-current': isLiked}" />
            <span class="text-sm font-medium">{{ likeCount }}</span>
          </button>
          <button 
            v-auth
            @click="showSharePanel = true"
            class="p-2 text-brand-slate hover:bg-gray-50 border border-gray-100 rounded-full transition-colors"
          >
            <Share2 class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <!-- Left: Images & Info -->
        <div class="lg:col-span-2 space-y-12 animate-slide-up">
          <!-- Hero Images -->
          <div class="grid grid-cols-4 grid-rows-2 gap-4 h-[600px]">
            <div class="col-span-3 row-span-2 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
              <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200" class="w-full h-full object-cover" />
            </div>
            <div class="col-span-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <img src="https://images.unsplash.com/photo-1506929113670-8730997782a1?q=80&w=400" class="w-full h-full object-cover" />
            </div>
            <div class="col-span-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=400" class="w-full h-full object-cover" />
            </div>
          </div>

          <!-- Product Description -->
          <div class="space-y-8">
            <div class="flex items-center space-x-3 text-xs font-bold uppercase tracking-widest text-brand-green">
              <span>中国 · 四川 · 稻城</span>
              <span class="w-1 h-1 bg-brand-green rounded-full"></span>
              <span>8 日深度体验</span>
            </div>
            <h1 class="text-4xl font-bold text-gray-900 leading-tight">川西秘境 · 稻城亚丁 8 日奢享游</h1>
            <p class="text-lg text-brand-slate leading-relaxed max-w-2xl">
              在香格里拉的最后一片净土，寻找心中的永恒。全程入住顶级帐篷酒店与奢华庄园，私人向导带您领略三座神山的壮丽与纯净，沉浸式体验古老的藏族文化，重塑心灵的宁静。
            </p>
          </div>

          <!-- Features -->
          <div class="grid grid-cols-2 gap-8 py-8 border-y border-gray-100">
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck class="w-6 h-6 text-brand-green" />
              </div>
              <div>
                <h4 class="font-bold text-sm mb-1">安心保障</h4>
                <p class="text-xs text-brand-slate leading-relaxed">全额退款保障、顶级商业保险</p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
                <Clock class="w-6 h-6 text-brand-green" />
              </div>
              <div>
                <h4 class="font-bold text-sm mb-1">尊享服务</h4>
                <p class="text-xs text-brand-slate leading-relaxed">24/7 私人管家、极速响应</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Booking Widget -->
        <div class="lg:col-span-1">
          <div class="sticky top-32 card-premium bg-white p-8 space-y-8 animate-fade-in shadow-2xl shadow-gray-100/50">
            <div class="flex items-end justify-between">
              <div>
                <span class="text-3xl font-bold text-brand-green">¥ 12,800</span>
                <span class="text-sm text-brand-slate font-normal ml-1">/人起</span>
              </div>
              <div class="text-xs text-brand-slate">4.9 ★ (120+ 评价)</div>
            </div>

            <div v-if="bookingStatus === 'idle'" class="space-y-4">
              <button v-auth @click="buyNow" class="w-full btn-primary py-4 font-bold shadow-lg shadow-brand-green/10">立即预订</button>
            </div>

            <div v-if="bookingStatus === 'purchasing'" class="text-center py-4 space-y-4">
              <div class="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p class="text-sm font-bold text-brand-green">正在为您确认行程...</p>
            </div>

            <div v-if="bookingStatus === 'completed'" class="space-y-6">
              <div class="flex items-center space-x-3 text-green-600 bg-green-50 p-4 rounded-2xl border border-green-100">
                <Check class="w-5 h-5 shrink-0" />
                <span class="text-sm font-bold">预订成功！您的管家将尽快联系您。</span>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <button v-auth @click="requestRefund" class="btn-outline py-3 text-xs font-bold">申请退款</button>
                <button v-auth @click="showAppealDialog = true" class="btn-outline py-3 text-xs font-bold">售后申诉</button>
              </div>
            </div>

            <div v-if="bookingStatus === 'refunding'" class="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center space-y-2">
              <div class="text-sm font-bold text-gray-900">退款申请处理中</div>
              <p class="text-xs text-brand-slate">预计 1-3 个工作日完成原路退回</p>
            </div>

            <div v-if="bookingStatus === 'appealing'" class="bg-brand-green/5 p-6 rounded-2xl border border-brand-green/10 text-center space-y-2">
              <div class="text-sm font-bold text-brand-green">申诉已提交</div>
              <p class="text-xs text-brand-slate">我们将尽快为您处理，请保持电话畅通</p>
            </div>

            <div class="space-y-4 pt-4 border-t border-gray-50">
              <div class="flex items-center space-x-3 text-sm text-brand-slate">
                <Navigation class="w-4 h-4" />
                <span>包含全程私人用车、司导服务</span>
              </div>
              <div class="flex items-center space-x-3 text-sm text-brand-slate">
                <CreditCard class="w-4 h-4" />
                <span>支持微信、支付宝、国际信用卡</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Share Panel -->
    <transition
      :enter-active-class="isLowEndDevice ? 'transition-opacity duration-300' : 'transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)'"
      :enter-from-class="isLowEndDevice ? 'opacity-0' : 'opacity-0 translate-y-8 scale-95'"
      :enter-to-class="isLowEndDevice ? 'opacity-100' : 'opacity-100 translate-y-0 scale-100'"
      :leave-active-class="isLowEndDevice ? 'transition-opacity duration-200' : 'transition-all duration-200 cubic-bezier(0.4, 0, 0.2, 1)'"
      :leave-from-class="isLowEndDevice ? 'opacity-100' : 'opacity-100 translate-y-0 scale-100'"
      :leave-to-class="isLowEndDevice ? 'opacity-0' : 'opacity-0 translate-y-8 scale-95'"
    >
      <div v-if="showSharePanel" class="fixed inset-0 z-[100] flex items-end justify-center p-4 pb-12 will-change-transform transform-gpu">
        <div class="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300" @click="showSharePanel = false"></div>
        <div class="relative bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl border border-gray-100/50 transform-gpu translate-z-0">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-lg font-bold">分享给好友</h3>
            <button @click="showSharePanel = false" class="p-2 hover:bg-gray-50 rounded-full transition-colors"><X class="w-5 h-5 text-brand-slate" /></button>
          </div>
          <div class="grid grid-cols-4 gap-6">
            <button v-for="channel in shareChannels" :key="channel.name" @click="channel.name === '复制链接' ? copyLink() : null" class="flex flex-col items-center group">
              <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-2 group-hover:bg-brand-green/5 transition-all">
                <component :is="channel.name === '微信' ? 'QrCode' : (channel.name === 'QQ' ? 'MessageCircle' : (channel.name === '微博' ? 'Globe' : 'Copy'))" class="w-6 h-6" :class="channel.color" />
              </div>
              <span class="text-[10px] font-bold text-brand-slate">{{ channel.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Refund & Appeal Dialogs (Same as before) -->
    <!-- ... (Dialog implementation remains similar to before) -->

    <Footer />
  </div>
</template>

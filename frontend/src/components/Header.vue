<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { LogOut, User as UserIcon, LayoutDashboard, ChevronDown } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const isMenuOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  isMenuOpen.value = false
  router.push('/')
}
</script>

<template>
  <nav class="glass-nav px-8 py-4 flex items-center justify-between">
    <router-link to="/" class="text-2xl font-bold tracking-tight text-brand-green">青云旅游</router-link>
    
    <div class="hidden md:flex items-center space-x-12 text-sm font-medium">
      <router-link to="/domestic" class="hover:text-brand-green transition-colors" active-class="text-brand-green font-bold">国内游</router-link>
      <router-link to="/international" class="hover:text-brand-green transition-colors" active-class="text-brand-green font-bold">出境游</router-link>
      <router-link to="/visa" class="hover:text-brand-green transition-colors" active-class="text-brand-green font-bold">签证服务</router-link>
      
      <!-- Login / Console Button -->
      <div v-if="!authStore.isLogin">
        <router-link 
          to="/auth" 
          class="group relative px-8 py-2.5 bg-gradient-to-r from-brand-green to-emerald-600 text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brand-green/20 flex items-center justify-center overflow-hidden"
        >
          <span class="relative z-10 font-bold">立即登录</span>
          <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </router-link>
      </div>

      <div v-else class="relative">
        <button 
          @click="isMenuOpen = !isMenuOpen"
          class="flex items-center space-x-3 px-4 py-1.5 bg-brand-green text-white rounded-full transition-all hover:bg-brand-green/90 group"
        >
          <img :src="authStore.userInfo?.avatar" class="w-8 h-8 rounded-full border-2 border-white/20" alt="Avatar" />
          <span class="font-bold text-xs">进入控制台</span>
          <ChevronDown class="w-4 h-4 transition-transform duration-300" :class="{'rotate-180': isMenuOpen}" />
        </button>

        <!-- Dropdown Menu -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-2"
        >
          <div v-if="isMenuOpen" class="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[100]">
            <div class="px-4 py-3 border-b border-gray-50 mb-1">
              <p class="text-xs text-brand-slate font-medium">欢迎回来,</p>
              <p class="text-sm font-bold truncate">{{ authStore.userInfo?.nickname }}</p>
            </div>
            <button class="w-full px-4 py-2.5 text-left text-sm text-brand-slate hover:bg-gray-50 flex items-center space-x-3 transition-colors">
              <UserIcon class="w-4 h-4" />
              <span>个人中心</span>
            </button>
            <button class="w-full px-4 py-2.5 text-left text-sm text-brand-slate hover:bg-gray-50 flex items-center space-x-3 transition-colors">
              <LayoutDashboard class="w-4 h-4" />
              <span>控制台</span>
            </button>
            <div class="h-px bg-gray-50 my-1 mx-2"></div>
            <button 
              @click="handleLogout"
              class="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 flex items-center space-x-3 transition-colors font-medium"
            >
              <LogOut class="w-4 h-4" />
              <span>退出登录</span>
            </button>
          </div>
        </transition>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, QrCode, RefreshCw, AlertCircle, User, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'
import { login as loginApi } from '../services/user'
import toast from '../utils/toast'
import RegisterPanel from '../components/RegisterPanel.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 登录方式：'wechat'、'password' 或 'register'
const loginMode = ref<'wechat' | 'password' | 'register'>('wechat')

// 表单数据
const form = ref({
  username: '',
  password: '',
  captcha: '',
  rememberMe: false
})

const showPassword = ref(false)
const isSubmitting = ref(false)

// 微信扫码逻辑
const qrStatus = ref<'loading' | 'active' | 'expired' | 'success' | 'error'>('loading')
const qrCodeUrl = ref('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=qyweb_mock_login')
const countdown = ref(0)
let timer: any = null

const refreshQrCode = () => {
  qrStatus.value = 'loading'
  setTimeout(() => {
    qrStatus.value = 'active'
    startCountdown()
  }, 800)
}

const startCountdown = () => {
  countdown.value = 60
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      qrStatus.value = 'expired'
      clearInterval(timer)
    }
  }, 1000)
}

// 账号密码登录逻辑
const handlePasswordLogin = async () => {
  if (!form.value.username || !form.value.password) {
    toast.error('请输入账号和密码')
    return
  }
  
  if (authStore.showCaptcha && !form.value.captcha) {
    toast.error('请输入验证码')
    return
  }

  isSubmitting.value = true
  try {
    const res = await loginApi(form.value.username, form.value.password, form.value.rememberMe)
    authStore.login(res.data)
    toast.success('登录成功')
    
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (error: any) {
    authStore.handleLoginFailure()
    toast.error(error.message || '登录失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  refreshQrCode()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="min-h-screen bg-[#F9FAFB] flex flex-col font-sans text-brand-slate">
    <!-- Header -->
    <header class="p-8 flex justify-start">
      <router-link to="/" class="group flex items-center space-x-3 bg-white/80 backdrop-blur-md border border-gray-100 px-5 py-2.5 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
        <div class="w-8 h-8 bg-brand-green/10 rounded-xl flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-colors duration-500">
          <ArrowLeft class="w-4 h-4" />
        </div>
        <span class="text-sm font-bold tracking-tight">返回首页</span>
      </router-link>
    </header>

    <main class="flex-grow flex items-center justify-center px-4 -mt-12">
      <div class="bg-white w-full max-w-lg rounded-[2.5rem] p-12 shadow-2xl shadow-gray-200/50 border border-gray-100/50 relative overflow-hidden">
        <!-- Decoration -->
        <div class="absolute top-0 right-0 w-48 h-48 bg-brand-green/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
        
        <div class="mb-10 text-center relative">
          <div class="text-3xl font-bold text-brand-green mb-2 tracking-tighter">青云旅游</div>
          <p class="text-xs text-brand-slate uppercase tracking-[0.2em] font-bold opacity-40">Bespoke Travel Experience</p>
        </div>

        <!-- Mode Switcher -->
        <div v-if="loginMode !== 'register'" class="flex p-1.5 bg-gray-50 rounded-2xl mb-10 border border-gray-100">
          <button 
            @click="loginMode = 'wechat'"
            class="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-500 flex items-center justify-center space-x-2"
            :class="loginMode === 'wechat' ? 'bg-white text-brand-green shadow-lg shadow-gray-200/50' : 'text-brand-slate opacity-50 hover:opacity-100'"
          >
            <QrCode class="w-4 h-4" />
            <span>微信扫码</span>
          </button>
          <button 
            @click="loginMode = 'password'"
            class="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-500 flex items-center justify-center space-x-2"
            :class="loginMode === 'password' ? 'bg-white text-brand-green shadow-lg shadow-gray-200/50' : 'text-brand-slate opacity-50 hover:opacity-100'"
          >
            <User class="w-4 h-4" />
            <span>账号登录</span>
          </button>
        </div>

        <!-- WeChat Login Content -->
        <div v-if="loginMode === 'wechat'" class="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div class="relative flex flex-col items-center">
            <div class="w-64 h-64 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-center relative group overflow-hidden shadow-inner p-4">
              <template v-if="qrStatus === 'loading'">
                <RefreshCw class="w-10 h-10 text-brand-green animate-spin opacity-40" />
              </template>
              
              <template v-else-if="qrStatus === 'active'">
                <img :src="qrCodeUrl" class="w-full h-full object-contain" alt="QR Code" />
              </template>

              <template v-else-if="qrStatus === 'expired' || qrStatus === 'error'">
                <div class="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-4">
                  <div class="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                    <AlertCircle class="w-6 h-6" />
                  </div>
                  <p class="text-sm font-bold text-gray-900">{{ qrStatus === 'expired' ? '二维码已过期' : '加载失败' }}</p>
                  <button @click="refreshQrCode" class="bg-brand-green text-white py-2 px-6 rounded-full text-xs font-bold flex items-center space-x-2 hover:bg-brand-green/90 transition-all">
                    <RefreshCw class="w-3 h-3" />
                    <span>刷新二维码</span>
                  </button>
                </div>
              </template>
            </div>

            <div class="mt-8 text-center space-y-2">
              <p class="text-sm text-brand-slate font-medium opacity-60">
                请使用微信扫描二维码登录
              </p>
              <p v-if="qrStatus === 'active'" class="text-[10px] text-brand-slate opacity-30 font-bold uppercase tracking-widest">
                Expires in {{ countdown }}s
              </p>
              <div class="pt-6">
                <button @click="loginMode = 'register'" class="text-xs font-bold text-brand-green hover:underline">立即注册账号</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Password Login Content -->
        <div v-else-if="loginMode === 'password'" class="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <form @submit.prevent="handlePasswordLogin" class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-bold text-brand-slate uppercase tracking-widest opacity-40 ml-1">Username / Phone</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User class="h-4 w-4 text-brand-slate opacity-20 group-focus-within:text-brand-green group-focus-within:opacity-100 transition-all" />
                </div>
                <input 
                  v-model="form.username"
                  type="text" 
                  placeholder="输入手机号或账号"
                  class="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green focus:bg-white transition-all duration-500"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-bold text-brand-slate uppercase tracking-widest opacity-40 ml-1">Password</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock class="h-4 w-4 text-brand-slate opacity-20 group-focus-within:text-brand-green group-focus-within:opacity-100 transition-all" />
                </div>
                <input 
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="输入登录密码"
                  class="block w-full pl-11 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green focus:bg-white transition-all duration-500"
                />
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-slate opacity-20 hover:opacity-100 transition-opacity"
                >
                  <Eye v-if="!showPassword" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Captcha Area (Show if failed >= 3 times) -->
            <div v-if="authStore.showCaptcha" class="space-y-2 animate-in slide-in-from-top-2 duration-500">
              <label class="text-[10px] font-bold text-brand-slate uppercase tracking-widest opacity-40 ml-1">Security Code</label>
              <div class="flex space-x-3">
                <div class="relative group flex-grow">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck class="h-4 w-4 text-brand-slate opacity-20 group-focus-within:text-brand-green group-focus-within:opacity-100 transition-all" />
                  </div>
                  <input 
                    v-model="form.captcha"
                    type="text" 
                    placeholder="输入图形验证码"
                    class="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green focus:bg-white transition-all duration-500"
                  />
                </div>
                <div class="w-32 bg-gray-100 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors border border-gray-100 overflow-hidden">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x40&data=CAPTCHA" class="w-full h-full object-cover opacity-50 grayscale" alt="captcha" />
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between px-1">
              <label class="flex items-center space-x-2 cursor-pointer group">
                <input 
                  v-model="form.rememberMe"
                  type="checkbox" 
                  class="w-4 h-4 rounded-md border-gray-200 text-brand-green focus:ring-brand-green/20 transition-all cursor-pointer"
                />
                <span class="text-xs font-bold text-brand-slate opacity-50 group-hover:opacity-100 transition-opacity">记住我 (7天免登录)</span>
              </label>
              <button @click="loginMode = 'register'" type="button" class="text-xs font-bold text-brand-green hover:underline">立即注册</button>
            </div>

            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full bg-brand-green text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-brand-green/20 hover:bg-brand-green/90 active:scale-[0.98] transition-all duration-500 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <span>{{ isSubmitting ? '正在安全登录...' : '立即登录' }}</span>
            </button>
          </form>
        </div>

        <!-- Register Content -->
        <div v-else-if="loginMode === 'register'">
          <div class="mb-8 text-left">
            <h3 class="text-xl font-bold text-gray-900">创建新账户</h3>
            <p class="text-xs text-brand-slate opacity-40 font-medium mt-1">开始您的青云奢享之旅</p>
          </div>
          <RegisterPanel :onSwitchToLogin="() => loginMode = 'password'" />
        </div>

        <!-- Footer Link -->
        <div class="mt-12 text-center pt-8 border-t border-gray-50">
          <p class="text-[10px] text-brand-slate font-medium leading-relaxed opacity-40">
            登录即代表您同意 <a href="#" class="text-brand-green hover:underline">服务协议</a> 与 <a href="#" class="text-brand-green hover:underline">隐私政策</a>
          </p>
        </div>
      </div>
    </main>

    <!-- Footer Copyright -->
    <footer class="p-8 text-center text-[10px] text-brand-slate uppercase tracking-widest opacity-30">
      © 2026 Qingyun Travel . Security Verified
    </footer>
  </div>
</template>

<style scoped>
.animate-in {
  animation-fill-mode: forwards;
}
</style>

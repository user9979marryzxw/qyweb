<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, ShieldCheck, Eye, EyeOff, Smartphone, Mail, RefreshCw } from 'lucide-vue-next'
import { registerAccount, checkAccountAvailability } from '../services/register'
import { useAuthStore } from '../stores/auth'
import toast from '../utils/toast'

const props = defineProps<{
  onSwitchToLogin: () => void
}>()

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  account: '',
  password: '',
  confirmPassword: '',
  captcha: '',
  verifyCode: '',
  agreed: false
})

const showPassword = ref(false)
const isSubmitting = ref(false)
const isCheckingAccount = ref(false)
const accountError = ref('')

// 校验账号是否已注册
const handleAccountBlur = async () => {
  if (!form.value.account) return
  const isEmail = form.value.account.includes('@')
  isCheckingAccount.value = true
  try {
    const available = await checkAccountAvailability(isEmail ? 'email' : 'phone', form.value.account)
    accountError.value = available ? '' : '该账号已被注册'
  } finally {
    isCheckingAccount.value = false
  }
}

// 注册逻辑
const handleRegister = async () => {
  if (!form.value.agreed) {
    toast.warning('请阅读并同意服务协议')
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    toast.error('两次输入的密码不一致')
    return
  }
  if (form.value.password.length < 8) {
    toast.error('密码长度至少为 8 位')
    return
  }

  isSubmitting.value = true
  try {
    const isEmail = form.value.account.includes('@')
    const res = await registerAccount({
      phone: isEmail ? undefined : form.value.account,
      email: isEmail ? form.value.account : undefined,
      password: form.value.password,
      captcha: form.value.captcha,
      smsCode: isEmail ? undefined : form.value.verifyCode,
      emailCode: isEmail ? form.value.verifyCode : undefined
    })
    
    toast.success('注册成功，正在为您登录...')
    // 注册成功自动登录
    authStore.login(res.data as any)
    router.push('/')
  } catch (error: any) {
    toast.error(error.message || '注册失败')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="animate-in fade-in slide-in-from-bottom-4 duration-700">
    <form @submit.prevent="handleRegister" class="space-y-5">
      <!-- Account -->
      <div class="space-y-1.5">
        <label class="text-[10px] font-bold text-brand-slate uppercase tracking-widest opacity-40 ml-1">Phone / Email</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Smartphone v-if="!form.account.includes('@')" class="h-4 w-4 text-brand-slate opacity-20 group-focus-within:text-brand-green group-focus-within:opacity-100 transition-all" />
            <Mail v-else class="h-4 w-4 text-brand-slate opacity-20 group-focus-within:text-brand-green group-focus-within:opacity-100 transition-all" />
          </div>
          <input 
            v-model="form.account"
            type="text" 
            @blur="handleAccountBlur"
            placeholder="输入手机号或邮箱"
            class="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green focus:bg-white transition-all duration-500"
            :class="{'border-red-400': accountError}"
          />
        </div>
        <p v-if="accountError" class="text-[10px] text-red-500 ml-1">{{ accountError }}</p>
      </div>

      <!-- Password -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-brand-slate uppercase tracking-widest opacity-40 ml-1">Password</label>
          <div class="relative group">
            <input 
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="设置密码"
              class="block w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green focus:bg-white transition-all duration-500"
            />
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-brand-slate uppercase tracking-widest opacity-40 ml-1">Confirm</label>
          <div class="relative group">
            <input 
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="确认密码"
              class="block w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green focus:bg-white transition-all duration-500"
            />
          </div>
        </div>
      </div>

      <!-- Captcha & Verify Code -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-brand-slate uppercase tracking-widest opacity-40 ml-1">Captcha</label>
          <div class="relative flex space-x-2">
            <input 
              v-model="form.captcha"
              type="text" 
              placeholder="验证码"
              class="block w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green focus:bg-white transition-all duration-500"
            />
            <div class="w-24 h-13 shrink-0 bg-gray-100 rounded-xl overflow-hidden cursor-pointer border border-gray-100">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x50&data=CAPTCHA" class="w-full h-full object-cover grayscale opacity-50" />
            </div>
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-brand-slate uppercase tracking-widest opacity-40 ml-1">Verify Code</label>
          <div class="relative group">
            <input 
              v-model="form.verifyCode"
              type="text" 
              placeholder="短信码"
              class="block w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green focus:bg-white transition-all duration-500"
            />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-brand-green hover:opacity-70 transition-opacity">获取验证码</button>
          </div>
        </div>
      </div>

      <!-- Agreement -->
      <div class="px-1 py-2">
        <label class="flex items-center space-x-3 cursor-pointer group">
          <div class="relative flex items-center justify-center">
            <input 
              v-model="form.agreed"
              type="checkbox" 
              class="peer h-5 w-5 appearance-none rounded-lg border-2 border-gray-100 bg-gray-50 checked:bg-brand-green checked:border-brand-green transition-all cursor-pointer"
            />
            <ShieldCheck class="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
          </div>
          <span class="text-[11px] font-medium text-brand-slate opacity-50 group-hover:opacity-100 transition-opacity">
            我已阅读并同意 <a href="#" class="text-brand-green hover:underline">《用户服务协议》</a> 与 <a href="#" class="text-brand-green hover:underline">《隐私政策》</a>
          </span>
        </label>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-4 pt-2">
        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="w-full bg-brand-green text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-brand-green/20 hover:bg-brand-green/90 active:scale-[0.98] transition-all duration-500 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          <span>{{ isSubmitting ? '正在安全创建账户...' : '立即注册账号' }}</span>
        </button>
        
        <button 
          @click="onSwitchToLogin"
          type="button"
          class="w-full py-4 rounded-2xl text-sm font-bold text-brand-slate hover:bg-gray-50 transition-all duration-500 border border-transparent hover:border-gray-100"
        >
          已有账号？返回登录
        </button>
      </div>
    </form>
  </div>
</template>

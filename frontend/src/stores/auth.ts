import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {data} from "autoprefixer";

interface UserInfo {
  username: string
  nickname: string
  avatar: string
  userId: number
  isAdmin: boolean
  [key: string]: any
}
//
interface AuthState {
  accessToken: string | null
  userInfo: UserInfo | null
}

// 注意：由于不能使用 localStorage 存储明文，我们主要在内存中维护状态
// 对于“记住我”功能，通常建议后端设置 httpOnly + secure cookie
// 这里我们在前端内存中维护，如果需要持久化且不能用 localStorage，
// 可以考虑使用加密后的 cookie 或 IndexedDB (此处演示内存存储)

export const useAuthStore = defineStore('auth', () => {
  const isLogin = ref(false)
  const accessToken = ref<string | null>(null)
  const userInfo = ref<UserInfo | null>(null)
  const loginAttempts = ref(0)
  const showCaptcha = ref(false)

  const isAdmin = computed(() => !!userInfo.value?.isAdmin)

  /**
   * 登录成功处理
   */
  const login = (data: { token: string, userId: number, username: string, nickname: string, avatar: string, isAdmin: boolean }) => {
    accessToken.value = data.token
    userInfo.value = {
      userId: data.userId,
      username: data.username,
      nickname: data.nickname || '',
      avatar: data.avatar || '',
      isAdmin: !!data.isAdmin
    }
    isLogin.value = true
    loginAttempts.value = 0
    showCaptcha.value = false
    
    // 如果勾选了“记住我”，由于前端无法直接设置 httpOnly，这里通常由后端在 /login 响应头中 set-cookie
    // 前端只需把 token 存入内存即可
  }

  /**
   * 登录失败处理
   */
  const handleLoginFailure = () => {
    loginAttempts.value++
    if (loginAttempts.value >= 3) {
      showCaptcha.value = true
    }
  }

  /**
   * 清除登录状态（登出或 401 时调用）
   */
  const clearAuth = () => {
    accessToken.value = null
    userInfo.value = null
    isLogin.value = false
    // 清除可能存在的 persistence cookie (如果由前端维护)
    document.cookie = 'qy_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict; Secure'
  }

  const logout = () => {
    clearAuth()
    window.location.href = '/auth' // 强制跳转到登录页
  }

  const checkAuth = () => {
    // 实际项目中这里应通过 cookie 或调用后端 /me 接口校验状态
    // 目前简单返回内存状态
    return isLogin.value
  }

  return {
    isLogin,
    userInfo,
    accessToken,
    isAdmin,
    loginAttempts,
    showCaptcha,
    login,
    logout,
    clearAuth,
    checkAuth,
    handleLoginFailure
  }
})

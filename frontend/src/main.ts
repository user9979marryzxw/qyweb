import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/main.css'
import { useAuthStore } from './stores/auth'
import toast from './utils/toast'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 注册全局权限指令 v-auth
app.directive('auth', {
  mounted(el, binding) {
    const authStore = useAuthStore()
    const handler = (e: Event) => {
      if (!authStore.isLogin) {
        e.preventDefault()
        e.stopPropagation()
        toast.warning('请先登录后操作')
        setTimeout(() => {
          router.push('/auth')
        }, 1500)
      }
    }

    el._authHandler = handler
    el.addEventListener('click', handler, true)

    // 如果未登录，应用禁用样式
    if (!authStore.isLogin) {
      el.style.opacity = '0.5'
      el.style.cursor = 'not-allowed'
      // 在按钮内部追加锁形图标 (如果 el 是按钮)
      if (el.tagName === 'BUTTON') {
        const lockIcon = document.createElement('span')
        lockIcon.innerHTML = '🔒'
        lockIcon.style.marginLeft = '4px'
        lockIcon.style.fontSize = '10px'
        el.appendChild(lockIcon)
      }
    }
  },
  unmounted(el) {
    el.removeEventListener('click', el._authHandler, true)
  }
})

app.mount('#app')

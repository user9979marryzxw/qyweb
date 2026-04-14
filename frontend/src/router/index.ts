import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { useAuthStore } from '../stores/auth'
import toast from '../utils/toast'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/domestic',
    name: 'Domestic',
    component: () => import('../views/Domestic.vue')
  },
  {
    path: '/international',
    name: 'International',
    component: () => import('../views/International.vue')
  },
  {
    path: '/visa',
    name: 'Visa',
    component: () => import('../views/Visa.vue')
  },
  {
    path: '/custom-domestic',
    name: 'CustomDomestic',
    component: () => import('../views/Domestic.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/global-tour',
    name: 'GlobalTour',
    component: () => import('../views/International.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue')
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 检查权限
  if (!authStore.isLogin) {
    authStore.checkAuth()
  }

  const requiresAuth = to.meta.requiresAuth
  if (requiresAuth && !authStore.isLogin) {
    toast.warning('请先登录后访问')
    setTimeout(() => {
      next({
        path: '/auth',
        query: { redirect: to.fullPath }
      })
    }, 1500)
  } else {
    next()
  }
})

export default router

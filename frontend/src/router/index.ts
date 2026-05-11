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
    // meta: { requiresAuth: true }
  },
  {
    path: '/global-tour',
    name: 'GlobalTour',
    component: () => import('../views/International.vue'),
    // meta: { requiresAuth: true }
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
  },
  {
    path: '/console',
    name: 'Console',
    component: () => import('../views/ConsoleLayout.vue'),
    redirect: '/console/dashboard',
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'ConsoleDashboard',
        component: () => import('../views/ConsoleDashboard.vue')
      },
      {
        path: 'products',
        name: 'ConsoleProducts',
        component: () => import('../views/ConsoleProducts.vue')
      },
      {
        path: 'orders',
        name: 'ConsoleOrders',
        component: () => import('../views/ConsoleOrders.vue')
      },
      {
        path: 'users',
        name: 'ConsoleUsers',
        component: () => import('../views/ConsoleUsers.vue')
      },
      {
        path: 'logs',
        name: 'ConsoleLogs',
        component: () => import('../views/ConsoleLogs.vue')
      }
    ]
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
  const requiresAdmin = to.meta.requiresAdmin

  if (requiresAuth && !authStore.isLogin) {
    toast.warning('请先登录后访问')
    setTimeout(() => {
      next({
        path: '/auth',
        query: { redirect: to.fullPath }
      })
    }, 1500)
  } else if (requiresAdmin && !authStore.isAdmin) {
    toast.error('权限不足，无法进入控制台')
    next('/')
  } else {
    next()
  }
})

export default router

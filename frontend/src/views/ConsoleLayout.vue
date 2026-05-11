<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  LogOut, 
  Bell, 
  Search, 
  ChevronDown,
  Menu,
  X,
  ChevronRight
} from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'
import toast from '../utils/toast'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isSidebarCollapsed = ref(false)
const isMobileMenuOpen = ref(false)

const menuItems = [
  { id: 'dashboard', name: '仪表盘', icon: LayoutDashboard, path: '/console/dashboard' },
  { id: 'products', name: '商品管理', icon: Package, path: '/console/products' },
  { id: 'orders', name: '订单管理', icon: ShoppingCart, path: '/console/orders' },
  { id: 'users', name: '用户管理', icon: Users, path: '/console/users' },
  { id: 'logs', name: '系统日志', icon: FileText, path: '/console/logs' },
]

const handleLogout = () => {
  authStore.logout()
  router.push('/auth')
  toast.success('已安全退出控制台')
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const notifications = ref([
  { id: 1, text: '您有新的退款申请待处理', time: '5分钟前', type: 'warning' },
  { id: 2, text: '商品 "瑞士10日游" 库存不足', time: '1小时前', type: 'error' },
  { id: 3, text: '系统升级完成', time: '3小时前', type: 'info' },
])
</script>

<template>
  <div class="min-h-screen bg-[#F9FAFB] flex font-sans text-brand-slate overflow-hidden">
    <!-- Sidebar -->
    <aside 
      class="fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 transition-all duration-500 ease-apple"
      :class="[
        isSidebarCollapsed ? 'w-20' : 'w-72',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="h-full flex flex-col">
        <!-- Logo Section -->
        <div class="h-20 flex items-center px-6 border-b border-gray-50 shrink-0">
          <div class="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-green/20">
            <span class="text-white font-black text-xl">Q</span>
          </div>
          <div 
            class="ml-4 transition-opacity duration-300 whitespace-nowrap overflow-hidden"
            :class="isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'"
          >
            <h1 class="text-lg font-bold tracking-tight text-brand-slate">青云控制台</h1>
            <p class="text-[10px] text-brand-green font-bold uppercase tracking-widest opacity-60">Admin Management</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-grow py-8 px-4 space-y-2 overflow-y-auto scrollbar-hide">
          <router-link 
            v-for="item in menuItems" 
            :key="item.id"
            :to="item.path"
            class="flex items-center h-12 rounded-xl transition-all duration-300 group px-4"
            :class="route.path.startsWith(item.path) ? 'bg-brand-green/5 text-brand-green shadow-sm shadow-brand-green/5' : 'text-brand-slate/60 hover:bg-gray-50 hover:text-brand-slate'"
          >
            <component :is="item.icon" class="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" :class="route.path.startsWith(item.path) ? 'text-brand-green' : 'opacity-40 group-hover:opacity-100'" />
            <span 
              class="ml-4 text-sm font-bold transition-all duration-300"
              :class="isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'"
            >
              {{ item.name }}
            </span>
            <ChevronRight 
              v-if="!isSidebarCollapsed" 
              class="ml-auto w-4 h-4 opacity-0 group-hover:opacity-40 transition-all" 
              :class="route.path.startsWith(item.path) ? 'opacity-100 translate-x-0' : '-translate-x-2'"
            />
          </router-link>
        </nav>

        <!-- Sidebar Footer -->
        <div class="p-4 border-t border-gray-50">
          <button 
            @click="handleLogout"
            class="flex items-center w-full h-12 px-4 rounded-xl text-brand-slate/60 hover:bg-red-50 hover:text-red-500 transition-all duration-300 group"
          >
            <LogOut class="w-5 h-5 shrink-0 transition-transform group-hover:-translate-x-1" />
            <span 
              class="ml-4 text-sm font-bold transition-all duration-300"
              :class="isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'"
            >
              退出登录
            </span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main 
      class="flex-grow flex flex-col transition-all duration-500 ease-apple"
      :class="isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'"
    >
      <!-- Top Header -->
      <header class="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40">
        <div class="flex items-center space-x-4">
          <button @click="toggleSidebar" class="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:flex hidden">
            <Menu v-if="isSidebarCollapsed" class="w-5 h-5 text-brand-slate/60" />
            <X v-else class="w-5 h-5 text-brand-slate/60" />
          </button>
          <div class="relative group lg:flex hidden">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-slate opacity-20 group-focus-within:text-brand-green group-focus-within:opacity-100 transition-all" />
            <input 
              type="text" 
              placeholder="搜索功能、订单、用户..." 
              class="w-64 bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-4 focus:ring-brand-green/5 focus:border-brand-green/30 transition-all"
            />
          </div>
        </div>

        <div class="flex items-center space-x-6">
          <div class="relative group">
            <button class="p-2.5 hover:bg-gray-100 rounded-xl transition-colors relative">
              <Bell class="w-5 h-5 text-brand-slate/60" />
              <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <!-- Dropdown placeholder -->
          </div>

          <div class="h-8 w-px bg-gray-100"></div>

          <div class="flex items-center space-x-3 cursor-pointer group">
            <div class="text-right lg:block hidden">
              <p class="text-xs font-black text-brand-slate">{{ authStore.userInfo?.nickname || '管理员' }}</p>
              <p class="text-[10px] text-brand-green font-bold uppercase tracking-widest opacity-60">Super Admin</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-gray-100 border-2 border-white shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <img :src="authStore.userInfo?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=Admin`" alt="avatar" />
            </div>
            <ChevronDown class="w-4 h-4 text-brand-slate opacity-20 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </header>

      <!-- View Container -->
      <div class="flex-grow overflow-y-auto p-8 scrollbar-hide">
        <router-view v-slot="{ Component }">
          <transition 
            name="fade-slide" 
            mode="out-in"
            appear
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Mobile Menu Overlay -->
    <div 
      v-if="isMobileMenuOpen" 
      @click="isMobileMenuOpen = false"
      class="fixed inset-0 bg-brand-slate/20 backdrop-blur-sm z-40 lg:hidden"
    ></div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.ease-apple {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
</style>

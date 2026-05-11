<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Download, Filter, Eye, UserPlus, MoreVertical, Shield, Mail, Smartphone, Calendar, RefreshCw, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-vue-next'
import { getConsoleUsers } from '../services/console'
import toast from '../utils/toast'

const users = ref<any[]>([])
const isLoading = ref(true)
const page = ref(1)
const totalPages = ref(1)
const activeType = ref('全部')
const userTypes = ['全部', '管理员', '普通用户']

const fetchUsers = async () => {
  try {
    isLoading.value = true
    const res = await getConsoleUsers({
      pageNo: page.value,
      pageSize: 8,
      isAdmin: activeType.value === '全部' ? undefined : (activeType.value === '管理员')
    })
    if (res.code === 1) {
      users.value = res.data.list
      totalPages.value = res.data.pages
    }
  } catch (error) {
    toast.error('获取用户列表失败')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

const handleExport = () => {
  toast.success('正在导出用户库...')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-brand-slate tracking-tight">用户管理</h2>
        <p class="text-[10px] text-brand-slate opacity-40 font-bold uppercase tracking-widest mt-1">User Directory & Permissions</p>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="handleExport" class="bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-xs font-bold text-brand-slate hover:bg-gray-50 transition-all flex items-center space-x-2 shadow-sm">
          <Download class="w-4 h-4 opacity-40" />
          <span>导出用户库</span>
        </button>
        <button class="bg-brand-green text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-brand-green/20 hover:bg-brand-green/90 transition-all flex items-center space-x-2">
          <UserPlus class="w-4 h-4" />
          <span>手动邀请用户</span>
        </button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white p-4 rounded-3xl border border-gray-100 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div class="flex items-center space-x-2">
        <button 
          v-for="t in userTypes" 
          :key="t"
          @click="activeType = t; page = 1; fetchUsers()"
          class="px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
          :class="activeType === t ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'text-brand-slate/40 hover:bg-gray-50'"
        >
          {{ t }}
        </button>
      </div>
      <div class="flex items-center space-x-3">
        <div class="relative group">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-slate opacity-20 group-focus-within:text-brand-green transition-colors" />
          <input type="text" placeholder="搜索姓名、邮箱、手机号..." class="w-64 bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-4 focus:ring-brand-green/5 focus:border-brand-green transition-all" />
        </div>
        <button class="p-2.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-all">
          <Filter class="w-4 h-4 text-brand-slate opacity-40" />
        </button>
      </div>
    </div>

    <!-- User Cards Grid -->
    <div v-if="isLoading" class="p-20 flex flex-col items-center justify-center space-y-4 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
      <RefreshCw class="w-8 h-8 text-brand-green animate-spin opacity-40" />
      <p class="text-xs font-bold text-brand-slate opacity-40 uppercase tracking-widest">正在检索用户数据...</p>
    </div>
    <div v-else class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="user in users" 
          :key="user.id"
          class="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group relative overflow-hidden"
        >
          <div class="absolute top-0 right-0 p-4">
            <button class="text-brand-slate opacity-20 hover:opacity-100 transition-opacity">
              <MoreVertical class="w-5 h-5" />
            </button>
          </div>

          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 rounded-3xl bg-gray-100 border-4 border-white shadow-sm overflow-hidden mb-4 group-hover:scale-110 transition-transform duration-500">
              <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`" alt="avatar" />
            </div>
            <h3 class="text-sm font-black text-brand-slate group-hover:text-brand-green transition-colors">{{ user.name }}</h3>
            <div class="flex items-center space-x-1.5 mt-2">
              <Shield class="w-3 h-3" :class="user.isAdmin ? 'text-brand-green' : 'text-blue-400'" />
              <span class="text-[10px] font-bold uppercase tracking-widest" :class="user.isAdmin ? 'text-brand-green' : 'text-blue-400'">{{ user.isAdmin ? '管理员' : '普通用户' }}</span>
            </div>

            <div class="w-full h-px bg-gray-50 my-6"></div>

            <div class="w-full space-y-3">
              <div class="flex items-center space-x-3 text-[11px] font-bold text-brand-slate/60">
                <Mail class="w-3.5 h-3.5 opacity-40" />
                <span>{{ user.email }}</span>
              </div>
              <div class="flex items-center space-x-3 text-[11px] font-bold text-brand-slate/60">
                <Smartphone class="w-3.5 h-3.5 opacity-40" />
                <span>{{ user.phone }}</span>
              </div>
              <div class="flex items-center space-x-3 text-[11px] font-bold text-brand-slate/60">
                <Calendar class="w-3.5 h-3.5 opacity-40" />
                <span>注册于 {{ user.regDate }}</span>
              </div>
            </div>

            <div class="mt-8 w-full flex items-center space-x-2">
              <button class="flex-grow py-2.5 rounded-xl bg-gray-50 text-[10px] font-bold text-brand-slate/40 hover:bg-brand-green/5 hover:text-brand-green transition-all uppercase tracking-widest">编辑资料</button>
              <button class="p-2.5 rounded-xl bg-gray-50 text-brand-slate/40 hover:bg-red-50 hover:text-red-500 transition-all">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <!-- Status Tag -->
          <div class="absolute top-6 left-6">
            <span 
              class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest"
              :class="user.status === '正常' ? 'bg-brand-green/10 text-brand-green' : 'bg-red-50 text-red-400'"
            >
              {{ user.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
        <p class="text-[10px] font-bold text-brand-slate opacity-40 uppercase tracking-widest">显示 {{ users.length }} 位成员，共 {{ totalPages * 8 }} 位</p>
        <div class="flex items-center space-x-2">
          <button 
            @click="page > 1 && (page--, fetchUsers())"
            class="p-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all"
            :disabled="page === 1"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <div class="flex items-center space-x-1">
            <button 
              v-for="p in totalPages" 
              :key="p"
              @click="page = p; fetchUsers()"
              class="w-10 h-10 rounded-xl text-xs font-bold transition-all"
              :class="page === p ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'hover:bg-gray-100 text-brand-slate/40'"
            >
              {{ p }}
            </button>
          </div>
          <button 
            @click="page < totalPages && (page++, fetchUsers())"
            class="p-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all"
            :disabled="page === totalPages"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

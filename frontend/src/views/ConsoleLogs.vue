<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Download, Filter, FileText, ChevronLeft, ChevronRight, RefreshCw, Clock, Terminal } from 'lucide-vue-next'
import { getConsoleLogs } from '../services/console'
import toast from '../utils/toast'

const logs = ref<any[]>([])
const isLoading = ref(true)
const page = ref(1)
const totalPages = ref(1)
const activeType = ref('全部')
const types = ['全部', 'INFO', 'WARN', 'ERROR', 'DEBUG']

const fetchLogs = async () => {
  try {
    isLoading.value = true
    const res = await getConsoleLogs({
      pageNo: page.value,
      pageSize: 15,
      type: activeType.value === '全部' ? undefined : activeType.value
    })
    if (res.code === 1) {
      logs.value = res.data.list
      totalPages.value = res.data.pages
    }
  } catch (error) {
    toast.error('获取日志列表失败')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchLogs()
})

const handleExport = () => {
  toast.success('正在导出系统日志...')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-brand-slate tracking-tight">系统日志</h2>
        <p class="text-[10px] text-brand-slate opacity-40 font-bold uppercase tracking-widest mt-1">Audit Trail & System Monitoring</p>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="handleExport" class="bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-xs font-bold text-brand-slate hover:bg-gray-50 transition-all flex items-center space-x-2 shadow-sm">
          <Download class="w-4 h-4 opacity-40" />
          <span>导出日志</span>
        </button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white p-4 rounded-3xl border border-gray-100 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div class="flex items-center space-x-2">
        <button 
          v-for="type in types" 
          :key="type"
          @click="activeType = type; page = 1; fetchLogs()"
          class="px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
          :class="activeType === type ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'text-brand-slate/40 hover:bg-gray-50'"
        >
          {{ type }}
        </button>
      </div>
      <div class="flex items-center space-x-3">
        <div class="relative group">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-slate opacity-20 group-focus-within:text-brand-green transition-colors" />
          <input type="text" placeholder="搜索操作内容、操作员..." class="w-64 bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-4 focus:ring-brand-green/5 focus:border-brand-green transition-all" />
        </div>
      </div>
    </div>

    <!-- Log Table -->
    <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div v-if="isLoading" class="p-20 flex flex-col items-center justify-center space-y-4">
        <RefreshCw class="w-8 h-8 text-brand-green animate-spin opacity-40" />
        <p class="text-xs font-bold text-brand-slate opacity-40 uppercase tracking-widest">正在检索审计日志...</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-[10px] font-bold text-brand-slate opacity-30 uppercase tracking-[0.2em] border-b border-gray-50 bg-gray-50/30">
              <th class="py-5 px-8">类型</th>
              <th class="py-5 px-8">模块</th>
              <th class="py-5 px-8">操作内容</th>
              <th class="py-5 px-8">操作员</th>
              <th class="py-5 px-8">IP 地址</th>
              <th class="py-5 px-8">操作时间</th>
              <th class="py-5 px-8">状态</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="log in logs" :key="log.id" class="group hover:bg-gray-50/50 transition-colors">
              <td class="py-5 px-8">
                <span 
                  class="text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest"
                  :class="{
                    'bg-blue-50 text-blue-500': log.type === 'INFO',
                    'bg-orange-50 text-orange-500': log.type === 'WARN',
                    'bg-red-50 text-red-500': log.type === 'ERROR',
                    'bg-gray-100 text-gray-400': log.type === 'DEBUG'
                  }"
                >
                  {{ log.type }}
                </span>
              </td>
              <td class="py-5 px-8">
                <span class="text-xs font-bold text-brand-slate/60">{{ log.module }}</span>
              </td>
              <td class="py-5 px-8">
                <p class="text-xs font-bold text-brand-slate group-hover:text-brand-green transition-colors">{{ log.action }}</p>
              </td>
              <td class="py-5 px-8">
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 rounded-md bg-gray-100 overflow-hidden shrink-0">
                    <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.operator}`" alt="operator" />
                  </div>
                  <span class="text-xs font-bold text-brand-slate">{{ log.operator }}</span>
                </div>
              </td>
              <td class="py-5 px-8">
                <span class="text-[11px] font-mono text-brand-slate/40">{{ log.ip }}</span>
              </td>
              <td class="py-5 px-8">
                <div class="flex items-center space-x-2 text-[10px] font-bold text-brand-slate opacity-30 uppercase tracking-widest">
                  <Clock class="w-3.5 h-3.5" />
                  <span>{{ log.time }}</span>
                </div>
              </td>
              <td class="py-5 px-8">
                <span 
                  class="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  :class="log.status === '成功' ? 'text-brand-green' : 'text-red-500'"
                >
                  {{ log.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="p-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/20">
        <p class="text-[10px] font-bold text-brand-slate opacity-40 uppercase tracking-widest">共 {{ totalPages * 15 }} 条审计记录</p>
        <div class="flex items-center space-x-2">
          <button 
            @click="page > 1 && (page--, fetchLogs())"
            class="p-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all"
            :disabled="page === 1"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <div class="flex items-center space-x-1">
            <button 
              v-for="p in Math.min(totalPages, 5)" 
              :key="p"
              @click="page = p; fetchLogs()"
              class="w-10 h-10 rounded-xl text-xs font-bold transition-all"
              :class="page === p ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'hover:bg-gray-100 text-brand-slate/40'"
            >
              {{ p }}
            </button>
          </div>
          <button 
            @click="page < totalPages && (page++, fetchLogs())"
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Download, Filter, MoreHorizontal, Eye, FileText, CheckCircle, Clock, AlertCircle, ChevronLeft, ChevronRight, RefreshCw, MoreVertical } from 'lucide-vue-next'
import { getConsoleOrders } from '../services/console'
import toast from '../utils/toast'

const orders = ref<any[]>([])
const isLoading = ref(true)
const page = ref(1)
const totalPages = ref(1)
const activeStatus = ref('全部')
const statuses = ['全部', '待审核', '处理中', '已支付', '已完成', '已取消']

const fetchOrders = async () => {
  try {
    isLoading.value = true
    const res = await getConsoleOrders({
      pageNo: page.value,
      pageSize: 10,
      status: activeStatus.value === '全部' ? undefined : activeStatus.value
    })
    if (res.code === 1) {
      orders.value = res.data.list
      totalPages.value = res.data.pages
    }
  } catch (error) {
    toast.error('获取订单列表失败')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})

const handleExport = () => {
  toast.success('正在导出订单数据...')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-brand-slate tracking-tight">订单管理</h2>
        <p class="text-[10px] text-brand-slate opacity-40 font-bold uppercase tracking-widest mt-1">Transaction & Order Tracking</p>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="handleExport" class="bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-xs font-bold text-brand-slate hover:bg-gray-50 transition-all flex items-center space-x-2 shadow-sm">
          <Download class="w-4 h-4 opacity-40" />
          <span>导出订单库</span>
        </button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white p-4 rounded-3xl border border-gray-100 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div class="flex items-center space-x-2">
        <button 
          v-for="status in statuses" 
          :key="status"
          @click="activeStatus = status; page = 1; fetchOrders()"
          class="px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
          :class="activeStatus === status ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'text-brand-slate/40 hover:bg-gray-50'"
        >
          {{ status }}
        </button>
      </div>
      <div class="flex items-center space-x-3">
        <div class="relative group">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-slate opacity-20 group-focus-within:text-brand-green transition-colors" />
          <input type="text" placeholder="搜索订单号、用户名..." class="w-64 bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-4 focus:ring-brand-green/5 focus:border-brand-green transition-all" />
        </div>
        <button class="p-2.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-all">
          <Filter class="w-4 h-4 text-brand-slate opacity-40" />
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div v-if="isLoading" class="p-20 flex flex-col items-center justify-center space-y-4">
        <RefreshCw class="w-8 h-8 text-brand-green animate-spin opacity-40" />
        <p class="text-xs font-bold text-brand-slate opacity-40 uppercase tracking-widest">正在检索订单数据...</p>
      </div>
      <table v-else class="w-full text-left">
        <thead>
          <tr class="text-[10px] font-bold text-brand-slate opacity-30 uppercase tracking-[0.2em] border-b border-gray-50 bg-gray-50/30">
            <th class="py-5 px-8">订单编号</th>
            <th class="py-5 px-8">客户信息</th>
            <th class="py-5 px-8">商品详情</th>
            <th class="py-5 px-8">交易金额</th>
            <th class="py-5 px-8">当前状态</th>
            <th class="py-5 px-8">下单时间</th>
            <th class="py-5 px-8 text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="order in orders" :key="order.id" class="group hover:bg-gray-50/50 transition-colors">
            <td class="py-5 px-8">
              <span class="text-[11px] font-black font-mono text-brand-slate/60">{{ order.id }}</span>
            </td>
            <td class="py-5 px-8">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-lg bg-gray-100 border border-gray-100 overflow-hidden shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.user}`" alt="user" />
                </div>
                <span class="text-xs font-bold text-brand-slate">{{ order.user }}</span>
              </div>
            </td>
            <td class="py-5 px-8">
              <div class="max-w-[180px]">
                <p class="text-xs font-bold text-brand-slate truncate group-hover:text-brand-green transition-colors">{{ order.product }}</p>
              </div>
            </td>
            <td class="py-5 px-8 text-xs font-black text-brand-slate">¥ {{ order.amount.toLocaleString() }}</td>
            <td class="py-5 px-8">
              <div class="flex items-center space-x-2">
                <span 
                  class="text-[10px] font-bold px-3 py-1 rounded-full flex items-center space-x-1"
                  :class="{
                    'bg-brand-green/10 text-brand-green': order.status === '已支付' || order.status === '已完成',
                    'bg-blue-50 text-blue-500': order.status === '处理中',
                    'bg-orange-50 text-orange-500': order.status === '待审核',
                    'bg-gray-100 text-gray-400': order.status === '已取消'
                  }"
                >
                  <CheckCircle v-if="order.status === '已完成'" class="w-3 h-3" />
                  <Clock v-else-if="order.status === '处理中'" class="w-3 h-3" />
                  <span>{{ order.status }}</span>
                </span>
              </div>
            </td>
            <td class="py-5 px-8">
              <span class="text-[10px] font-bold text-brand-slate opacity-30 uppercase tracking-widest">{{ order.time }}</span>
            </td>
            <td class="py-5 px-8 text-right">
              <div class="flex items-center justify-end space-x-2">
                <button class="p-2 hover:bg-brand-green/5 text-brand-slate/40 hover:text-brand-green rounded-lg transition-all">
                  <Eye class="w-4 h-4" />
                </button>
                <button class="p-2 hover:bg-gray-100 text-brand-slate/40 hover:text-brand-slate rounded-lg transition-all">
                  <MoreVertical class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="p-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/20">
        <p class="text-[10px] font-bold text-brand-slate opacity-40 uppercase tracking-widest">显示 {{ orders.length }} 条，共 {{ totalPages * 10 }} 条订单</p>
        <div class="flex items-center space-x-2">
          <button 
            @click="page > 1 && (page--, fetchOrders())"
            class="p-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all"
            :disabled="page === 1"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <div class="flex items-center space-x-1">
            <button 
              v-for="p in totalPages" 
              :key="p"
              @click="page = p; fetchOrders()"
              class="w-10 h-10 rounded-xl text-xs font-bold transition-all"
              :class="page === p ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'hover:bg-gray-100 text-brand-slate/40'"
            >
              {{ p }}
            </button>
          </div>
          <button 
            @click="page < totalPages && (page++, fetchOrders())"
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

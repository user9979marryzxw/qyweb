<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { 
  ShoppingCart, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ChevronDown,
  Activity,
  Calendar,
  CreditCard,
  UserCheck
} from 'lucide-vue-next'
import * as echarts from 'echarts'
import { getConsoleStats } from '../services/console'
import toast from '../utils/toast'

/**
 * 控制台仪表盘
 * 包含实时业务数据、销售趋势、任务列表和近期动态
 */

const chartRef = ref<HTMLElement | null>(null)
const isLoading = ref(true)
const dashboardStats = ref<any>(null)

const stats = computed(() => {
  if (!dashboardStats.value) return []
  return [
    { label: '今日销售额', value: dashboardStats.value.todaySales, change: dashboardStats.value.salesChange, isUp: true, icon: CreditCard, color: 'text-brand-green bg-brand-green/10' },
    { label: '待处理订单', value: dashboardStats.value.pendingOrders, change: dashboardStats.value.ordersChange, isUp: true, icon: ShoppingCart, color: 'text-blue-500 bg-blue-50' },
    { label: '新增用户', value: dashboardStats.value.newUsers, change: dashboardStats.value.usersChange, isUp: false, icon: UserCheck, color: 'text-purple-500 bg-purple-50' },
    { label: '库存预警', value: dashboardStats.value.stockAlerts, change: dashboardStats.value.alertsStatus, isUp: true, icon: Package, color: 'text-orange-500 bg-orange-50' },
  ]
})

const recentOrders = [
  { id: 'ORD-20260301', user: '李晓明', product: '瑞士阿尔卑斯10日游', amount: '¥ 35,800', status: '已支付', time: '10分钟前', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  { id: 'ORD-20260302', user: '王思齐', product: '泰国清迈6日深度游', amount: '¥ 8,800', status: '处理中', time: '25分钟前', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
  { id: 'ORD-20260303', user: '张婉莹', product: '欧洲申根签证办理', amount: '¥ 1,280', status: '待审核', time: '45分钟前', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella' },
  { id: 'ORD-20260304', user: '赵子豪', product: '日本京都赏枫7日游', amount: '¥ 22,800', status: '已完成', time: '1小时前', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb' },
]

const activities = [
  { id: 1, user: 'Admin', action: '更新了商品', target: '川藏南线318自驾', time: '2小时前', type: 'update' },
  { id: 2, user: 'System', action: '自动同步了', target: '汇率数据', time: '4小时前', type: 'sync' },
  { id: 3, user: 'Admin', action: '审核通过了', target: '用户退款申请', time: '5小时前', type: 'approve' },
]

const fetchData = async () => {
  try {
    isLoading.value = true
    const res = await getConsoleStats()
    if (res.code === 1) {
      dashboardStats.value = res.data
    }
  } catch (error) {
    toast.error('获取统计数据失败')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
  
  if (chartRef.value) {
    const chart = echarts.init(chartRef.value)
    const option: any = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 0,
        padding: [12, 16],
        textStyle: { color: '#111827', fontWeight: 'bold', fontSize: 12 },
        extraCssText: 'box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1); border-radius: 12px;',
        formatter: (params: any) => {
          return `<div class="flex items-center space-x-2">
                    <div class="w-2 h-2 rounded-full bg-brand-green"></div>
                    <span class="text-gray-400 font-medium">${params[0].name}</span>
                    <span class="text-brand-slate font-black">¥ ${params[0].value}k</span>
                  </div>`
        }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true, top: '10%' },
      xAxis: { 
        type: 'category', 
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], 
        axisLine: { show: false }, 
        axisTick: { show: false },
        axisLabel: { color: '#9CA3AF', fontWeight: 'bold', margin: 15 }
      },
      yAxis: { 
        type: 'value', 
        splitLine: { lineStyle: { type: 'dashed', color: '#f3f4f6' } }, 
        axisLine: { show: false },
        axisLabel: { color: '#9CA3AF', fontWeight: 'bold' }
      },
      series: [{
        data: [120, 200, 150, 80, 190, 240, 180],
        type: 'line',
        smooth: 0.4,
        showSymbol: false,
        lineStyle: { width: 5, color: '#00C38B', shadowColor: 'rgba(0, 195, 139, 0.3)', shadowBlur: 20, shadowOffsetY: 10 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 195, 139, 0.15)' },
            { offset: 1, color: 'rgba(0, 195, 139, 0)' }
          ])
        }
      }]
    }
    chart.setOption(option)

    window.addEventListener('resize', () => chart.resize())
  }
})
</script>

<template>
  <div class="space-y-8 pb-12 animate-in fade-in duration-700">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-brand-slate tracking-tight">业务概览</h2>
        <p class="text-xs text-brand-slate opacity-40 font-bold uppercase tracking-widest mt-1">Real-time Data Insights</p>
      </div>
      <div class="flex items-center space-x-3">
        <button class="bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-xs font-bold text-brand-slate hover:bg-gray-50 transition-all flex items-center space-x-2 shadow-sm">
          <Calendar class="w-4 h-4 opacity-40" />
          <span>2026年3月</span>
          <ChevronDown class="w-4 h-4 opacity-20" />
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <template v-if="isLoading">
        <div v-for="i in 4" :key="i" class="bg-white p-6 rounded-[2.5rem] border border-gray-100 h-44 animate-pulse"></div>
      </template>
      <template v-else>
        <div 
          v-for="stat in stats" 
          :key="stat.label"
          class="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500 group relative overflow-hidden"
        >
          <div class="flex items-center justify-between mb-4 relative z-10">
            <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 duration-500 shadow-sm', stat.color]">
              <component :is="stat.icon" class="w-7 h-7" />
            </div>
            <div :class="['flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black', stat.isUp ? 'text-brand-green bg-brand-green/10' : 'text-red-500 bg-red-50']">
              <ArrowUpRight v-if="stat.isUp" class="w-3 h-3" />
              <ArrowDownRight v-else class="w-3 h-3" />
              <span>{{ stat.change }}</span>
            </div>
          </div>
          <div class="relative z-10">
            <p class="text-[10px] font-bold text-brand-slate opacity-40 uppercase tracking-widest">{{ stat.label }}</p>
            <h3 class="text-2xl font-black text-brand-slate mt-1 tracking-tight">{{ stat.value }}</h3>
          </div>
          <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-gray-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
        </div>
      </template>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Chart Section -->
      <div class="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-lg font-black text-brand-slate tracking-tight">销售趋势</h3>
            <p class="text-[10px] text-brand-slate opacity-40 font-bold uppercase tracking-widest mt-0.5">Sales Revenue Trend</p>
          </div>
          <div class="flex items-center bg-gray-50 p-1 rounded-xl">
            <button class="px-4 py-1.5 rounded-lg text-[10px] font-bold bg-white shadow-sm text-brand-slate">周</button>
            <button class="px-4 py-1.5 rounded-lg text-[10px] font-bold text-brand-slate/40 hover:text-brand-slate transition-colors">月</button>
            <button class="px-4 py-1.5 rounded-lg text-[10px] font-bold text-brand-slate/40 hover:text-brand-slate transition-colors">年</button>
          </div>
        </div>
        <div ref="chartRef" class="w-full h-[320px]"></div>
      </div>

      <!-- Recent Activities -->
      <div class="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-lg font-black text-brand-slate tracking-tight">最近动态</h3>
            <p class="text-[10px] text-brand-slate opacity-40 font-bold uppercase tracking-widest mt-0.5">System Activity Logs</p>
          </div>
          <Activity class="w-5 h-5 text-brand-green opacity-40" />
        </div>
        <div class="space-y-6">
          <div v-for="act in activities" :key="act.id" class="flex items-start space-x-4 group cursor-pointer">
            <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-brand-green/5 transition-colors">
              <div class="w-2 h-2 rounded-full bg-brand-green shadow-sm shadow-brand-green/40"></div>
            </div>
            <div class="flex-grow">
              <p class="text-[11px] font-bold text-brand-slate leading-tight">
                <span class="text-brand-green">{{ act.user }}</span> {{ act.action }} 
                <span class="opacity-100">"{{ act.target }}"</span>
              </p>
              <p class="text-[10px] text-brand-slate opacity-30 font-bold mt-1 uppercase">{{ act.time }}</p>
            </div>
          </div>
        </div>
        <button class="w-full mt-8 py-3 rounded-2xl border border-gray-100 text-[10px] font-bold text-brand-slate/40 hover:text-brand-green hover:border-brand-green/30 hover:bg-brand-green/5 transition-all uppercase tracking-widest">
          查看全部动态
        </button>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
      <div class="p-8 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-black text-brand-slate tracking-tight">最新订单</h3>
          <p class="text-[10px] text-brand-slate opacity-40 font-bold uppercase tracking-widest mt-0.5">Latest Transactions</p>
        </div>
        <router-link to="/console/orders" class="text-[10px] font-bold text-brand-green uppercase tracking-widest hover:underline">管理订单</router-link>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-[10px] font-bold text-brand-slate opacity-30 uppercase tracking-[0.2em] bg-gray-50/50">
              <th class="py-4 px-8">客户</th>
              <th class="py-4 px-8">商品名称</th>
              <th class="py-4 px-8">交易金额</th>
              <th class="py-4 px-8">状态</th>
              <th class="py-4 px-8">时间</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="order in recentOrders" :key="order.id" class="group hover:bg-gray-50/30 transition-colors">
              <td class="py-5 px-8">
                <div class="flex items-center space-x-3">
                  <img :src="order.avatar" class="w-8 h-8 rounded-lg border-2 border-white shadow-sm" alt="avatar" />
                  <span class="text-xs font-black text-brand-slate">{{ order.user }}</span>
                </div>
              </td>
              <td class="py-5 px-8">
                <span class="text-xs font-bold text-brand-slate">{{ order.product }}</span>
              </td>
              <td class="py-5 px-8">
                <span class="text-xs font-black text-brand-slate">{{ order.amount }}</span>
              </td>
              <td class="py-5 px-8">
                <span 
                  class="text-[10px] font-bold px-3 py-1 rounded-full inline-block"
                  :class="{
                    'bg-brand-green/10 text-brand-green': order.status === '已支付' || order.status === '已完成',
                    'bg-blue-50 text-blue-500': order.status === '处理中',
                    'bg-orange-50 text-orange-500': order.status === '待审核'
                  }"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="py-5 px-8">
                <span class="text-[10px] font-bold text-brand-slate opacity-30 uppercase tracking-widest">{{ order.time }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-in {
  animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
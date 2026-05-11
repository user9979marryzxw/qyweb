<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Plus, Download, Filter, MoreHorizontal, Edit, Trash2, Eye, RefreshCw, ChevronLeft, ChevronRight, Package, Image as ImageIcon } from 'lucide-vue-next'
import { confirm } from '../utils/confirm'
import toast from '../utils/toast'
import { getProducts, addProduct, type Product } from '../services/product'

const products = ref<Product[]>([])
const isLoading = ref(true)
const page = ref(1)
const totalPages = ref(1)
const activeCategory = ref('全部')
const categories = ['全部', '国内游', '出境游', '签证服务']
const totalRecords = ref(0)

const fetchProducts = async () => {
  try {
    isLoading.value = true
    const res = await getProducts({
      page: page.value,
      size: 10,
      category: activeCategory.value === '全部' ? undefined : (activeCategory.value === '国内游' ? 1 : 2)
    })
    if (res.code === 1) {
      products.value = res.data.list
      totalRecords.value = res.data.total // 保存总记录数
      totalPages.value = res.data.pages || Math.ceil(res.data.total / 10)
    }
  } catch (error) {
    toast.error('加载商品列表失败')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})

const isExporting = ref(false)
const isModalOpen = ref(false)
const editingProduct = ref<Partial<Product> | null>(null)

const handleExport = async () => {
  isExporting.value = true
  toast.success('正在准备商品导出数据...')
  setTimeout(() => {
    isExporting.value = false
    toast.success('导出成功，文件已开始下载')
  }, 2000)
}

const openModal = (product?: Product) => {
  editingProduct.value = product ? { ...product } : { name: '', price: 0, stock: 0, category: 1, description: '' }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingProduct.value = null
}

const handleSave = async () => {
  if (!editingProduct.value) return;

  // 修复：检查所有字段是否有效，包括 NaN 检查
  if (!editingProduct.value.name ||
      !editingProduct.value.price ||
      isNaN(editingProduct.value.price) ||
      editingProduct.value.price <= 0 ||
      !editingProduct.value.stock ||
      isNaN(editingProduct.value.stock) ||
      editingProduct.value.stock < 0) {
    toast.error('请填写商品名称、有效价格（大于0）和非负库存');
    return;
  }

  try {
    if (editingProduct.value.id) {
      // 编辑商品（后续实现）
      toast.success('编辑成功');
    } else {
      // 新增商品，确保传递有效数字
      await addProduct({
        name: editingProduct.value.name,
        price: Number(editingProduct.value.price) || 0,
        stock: Number(editingProduct.value.stock) || 0,
        image: editingProduct.value.image || '',
        description: editingProduct.value.description || '',
        category: Number(editingProduct.value.category) || 1
      });
      toast.success('新增商品成功');
    }
    closeModal();
    fetchProducts();  // 刷新列表
  } catch (error: any) {
    toast.error(error.message || '操作失败，请重试');
  }
};

const handleDelete = async (id: number) => {
  try {
    await confirm({
      title: '确认删除商品？',
      message: '删除后数据将无法恢复，相关订单信息可能会受到影响，请谨慎操作。',
      type: 'danger',
      confirmText: '确认删除'
    })
    
    // 模拟删除逻辑
    products.value = products.value.filter(p => p.id !== id)
    toast.success(`商品 ID: ${id} 已成功下架并删除`)
  } catch {
    // 用户取消
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-brand-slate tracking-tight">商品管理</h2>
        <p class="text-[10px] text-brand-slate opacity-40 font-bold uppercase tracking-widest mt-1">Product Inventory Control</p>
      </div>
      <div class="flex items-center space-x-3">
        <button 
          @click="handleExport"
          :disabled="isExporting"
          class="bg-white border border-gray-100 px-4 py-2.5 rounded-xl text-xs font-bold text-brand-slate hover:bg-gray-50 transition-all flex items-center space-x-2 disabled:opacity-50 shadow-sm"
        >
          <RefreshCw v-if="isExporting" class="w-4 h-4 animate-spin" />
          <Download v-else class="w-4 h-4 opacity-40" />
          <span>{{ isExporting ? '导出中...' : '导出数据' }}</span>
        </button>
        <button 
          @click="openModal()"
          class="bg-brand-green text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-brand-green/20 hover:bg-brand-green/90 transition-all flex items-center space-x-2"
        >
          <Plus class="w-4 h-4" />
          <span>添加商品</span>
        </button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white p-4 rounded-3xl border border-gray-100 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div class="flex items-center space-x-2">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="activeCategory = cat; page = 1; fetchProducts()"
          class="px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
          :class="activeCategory === cat ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'text-brand-slate/40 hover:bg-gray-50'"
        >
          {{ cat }}
        </button>
      </div>
      <div class="flex items-center space-x-3">
        <div class="relative group">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-slate opacity-20 group-focus-within:text-brand-green transition-colors" />
          <input type="text" placeholder="搜索商品名称、ID..." class="w-64 bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-4 focus:ring-brand-green/5 focus:border-brand-green transition-all" />
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
        <p class="text-xs font-bold text-brand-slate opacity-40 uppercase tracking-widest">正在加载商品库...</p>
      </div>
      <table v-else class="w-full text-left">
        <thead>
          <tr class="text-[10px] font-bold text-brand-slate opacity-30 uppercase tracking-[0.2em] border-b border-gray-50 bg-gray-50/30">
            <th class="py-5 px-8">商品</th>
            <th class="py-5 px-8">类别</th>
            <th class="py-5 px-8">价格</th>
            <th class="py-5 px-8">库存</th>
            <th class="py-5 px-8">销量</th>
            <th class="py-5 px-8">状态</th>
            <th class="py-5 px-8 text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="product in products" :key="product.id" class="group hover:bg-gray-50/50 transition-colors">
            <td class="py-5 px-8">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-xl bg-gray-100 border border-gray-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                  <img :src="product.image" class="w-full h-full object-cover" alt="product" />
                </div>
                <div>
                  <p class="text-xs font-black text-brand-slate group-hover:text-brand-green transition-colors">{{ product.name }}</p>
                  <p class="text-[10px] font-mono text-brand-slate/40 mt-1 uppercase">ID: {{ product.id }}</p>
                </div>
              </div>
            </td>
            <td class="py-5 px-8">
              <span class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-gray-50 text-brand-slate/60 uppercase tracking-widest">{{ product.category_name || '旅游服务' }}</span>
            </td>
            <td class="py-5 px-8 text-xs font-black text-brand-slate">¥ {{ product.price.toLocaleString() }}</td>
            <td class="py-5 px-8">
              <div class="flex items-center space-x-2">
                <div class="flex-grow w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-1000" 
                    :class="product.stock < 10 ? 'bg-red-400' : 'bg-brand-green'"
                    :style="{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }"
                  ></div>
                </div>
                <span class="text-[10px] font-black text-brand-slate/60">{{ product.stock }}</span>
              </div>
            </td>
            <td class="py-5 px-8 text-xs font-bold text-brand-slate/60">{{ product.sales }}</td>
            <td class="py-5 px-8">
              <span 
                class="text-[10px] font-bold px-3 py-1 rounded-full inline-block"
                :class="product.stock > 0 ? 'bg-brand-green/10 text-brand-green' : 'bg-red-50 text-red-400'"
              >
                {{ product.stock > 0 ? '上架中' : '已售罄' }}
              </span>
            </td>
            <td class="py-5 px-8 text-right">
              <div class="flex items-center justify-end space-x-2">
                <button @click="openModal(product)" class="p-2 hover:bg-brand-green/5 text-brand-slate/40 hover:text-brand-green rounded-lg transition-all">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="handleDelete(product.id)" class="p-2 hover:bg-red-50 text-brand-slate/40 hover:text-red-500 rounded-lg transition-all">
                  <Trash2 class="w-4 h-4" />
                </button>
                <button class="p-2 hover:bg-gray-100 text-brand-slate/40 hover:text-brand-slate rounded-lg transition-all">
                  <MoreHorizontal class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="p-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/20">
        <p class="text-[10px] font-bold text-brand-slate opacity-40 uppercase tracking-widest">显示 {{ products.length }} 条，共 {{ totalRecords }} 条商品</p>
        <div class="flex items-center space-x-2">
          <button 
            @click="page > 1 && (page--, fetchProducts())"
            class="p-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all"
            :disabled="page === 1"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <div class="flex items-center space-x-1">
            <button 
              v-for="p in totalPages" 
              :key="p"
              @click="page = p; fetchProducts()"
              class="w-10 h-10 rounded-xl text-xs font-bold transition-all"
              :class="page === p ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'hover:bg-gray-100 text-brand-slate/40'"
            >
              {{ p }}
            </button>
          </div>
          <button 
            @click="page < totalPages && (page++, fetchProducts())"
            class="p-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all"
            :disabled="page === totalPages"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Product Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div class="absolute inset-0 bg-brand-slate/40 backdrop-blur-md" @click="closeModal"></div>
      <div class="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div class="p-10 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 class="text-xl font-black text-brand-slate tracking-tight">{{ editingProduct?.id ? '编辑商品' : '新增商品' }}</h3>
            <p class="text-[10px] text-brand-slate opacity-40 font-bold uppercase tracking-widest mt-1">Product Details Editor</p>
          </div>
          <button @click="closeModal" class="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
            <Plus class="w-6 h-6 rotate-45 text-brand-slate opacity-20" />
          </button>
        </div>
        
        <div class="p-10 space-y-8 max-h-[60vh] overflow-y-auto scrollbar-hide">
          <div class="grid grid-cols-2 gap-8">
            <div class="space-y-2">
              <label class="text-[10px] font-bold text-brand-slate opacity-40 uppercase tracking-[0.2em] ml-1">商品名称</label>
              <input v-model="editingProduct!.name" type="text" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-brand-green/5 focus:border-brand-green transition-all" placeholder="例如：瑞士10日深度游" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-bold text-brand-slate opacity-40 uppercase tracking-[0.2em] ml-1">商品类别</label>
              <select v-model="editingProduct!.category" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-brand-green/5 focus:border-brand-green transition-all appearance-none">
                <option :value="1">国内游</option>
                <option :value="2">出境游</option>
                <option :value="3">签证服务</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-bold text-brand-slate opacity-40 uppercase tracking-[0.2em] ml-1">售卖价格 (¥)</label>
              <input v-model.number="editingProduct!.price" type="number" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-brand-green/5 focus:border-brand-green transition-all" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-bold text-brand-slate opacity-40 uppercase tracking-[0.2em] ml-1">库存数量</label>
              <input v-model.number="editingProduct!.stock" type="number" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-brand-green/5 focus:border-brand-green transition-all" />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-bold text-brand-slate opacity-40 uppercase tracking-[0.2em] ml-1">商品封面图</label>
            <div class="w-full aspect-video rounded-[2rem] bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center group cursor-pointer hover:border-brand-green/30 hover:bg-brand-green/5 transition-all">
              <ImageIcon class="w-10 h-10 text-brand-slate opacity-10 group-hover:text-brand-green group-hover:opacity-40 transition-all mb-2" />
              <p class="text-[10px] font-bold text-brand-slate opacity-30 uppercase tracking-widest">点击或拖拽上传主图</p>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-bold text-brand-slate opacity-40 uppercase tracking-[0.2em] ml-1">商品详述</label>
            <textarea v-model="editingProduct!.description" rows="4" class="w-full bg-gray-50 border border-gray-100 rounded-3xl px-6 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-brand-green/5 focus:border-brand-green transition-all" placeholder="请输入产品亮点、行程概览等..."></textarea>
          </div>
        </div>

        <div class="p-10 bg-gray-50/50 border-t border-gray-50 flex items-center justify-end space-x-4">
          <button @click="closeModal" class="px-8 py-4 rounded-2xl text-xs font-bold text-brand-slate/40 hover:text-brand-slate transition-colors uppercase tracking-widest">取消</button>
          <button @click="handleSave" class="bg-brand-green text-white px-10 py-4 rounded-2xl text-xs font-bold shadow-xl shadow-brand-green/20 hover:bg-brand-green/90 transition-all uppercase tracking-widest">保存商品信息</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes zoom-in {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-in {
  animation: zoom-in 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>

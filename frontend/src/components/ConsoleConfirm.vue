<script setup lang="ts">
import { ref } from 'vue'
import { AlertTriangle, X } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const isVisible = ref(true)

const handleConfirm = () => {
  emit('confirm')
  isVisible.value = false
}

const handleCancel = () => {
  emit('cancel')
  isVisible.value = false
}
</script>

<template>
  <div v-if="isVisible" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-brand-slate/20 backdrop-blur-sm animate-in fade-in duration-300" @click="handleCancel"></div>
    
    <!-- Modal -->
    <div class="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl shadow-brand-slate/10 border border-gray-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
      <button @click="handleCancel" class="absolute top-6 right-6 p-2 hover:bg-gray-50 rounded-full transition-colors">
        <X class="w-4 h-4 opacity-20" />
      </button>

      <div class="flex flex-col items-center text-center">
        <div 
          class="w-16 h-16 rounded-3xl flex items-center justify-center mb-6"
          :class="type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'"
        >
          <AlertTriangle class="w-8 h-8" />
        </div>

        <h3 class="text-xl font-black text-brand-slate tracking-tight mb-2">{{ title }}</h3>
        <p class="text-sm font-medium text-brand-slate opacity-40 leading-relaxed">{{ message }}</p>

        <div class="grid grid-cols-2 gap-4 w-full mt-10">
          <button 
            @click="handleCancel"
            class="py-4 rounded-2xl text-sm font-bold text-brand-slate bg-gray-50 hover:bg-gray-100 transition-all duration-300"
          >
            {{ cancelText || '取消操作' }}
          </button>
          <button 
            @click="handleConfirm"
            class="py-4 rounded-2xl text-sm font-bold text-white shadow-lg transition-all duration-500 active:scale-[0.98]"
            :class="type === 'danger' ? 'bg-red-500 shadow-red-500/20 hover:bg-red-600' : 'bg-brand-green shadow-brand-green/20 hover:bg-brand-green/90'"
          >
            {{ confirmText || '确认提交' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

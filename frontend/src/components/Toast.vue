<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X, CheckCircle, AlertTriangle, XCircle } from 'lucide-vue-next'

export type ToastType = 'success' | 'warning' | 'error'

interface Props {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'success',
  duration: 2500
})

const visible = ref(true)

const close = () => {
  visible.value = false
  if (props.onClose) props.onClose()
}

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(close, props.duration)
  }
})
</script>

<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-[-100%] opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-[-100%] opacity-0"
  >
    <div v-if="visible" class="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] min-w-[320px] max-w-[90vw]">
      <div 
        class="bg-white rounded-2xl shadow-2xl border p-4 flex items-center space-x-4 animate-slide-up"
        :class="{
          'border-green-100 shadow-green-100/20': type === 'success',
          'border-orange-100 shadow-orange-100/20': type === 'warning',
          'border-red-100 shadow-red-100/20': type === 'error'
        }"
      >
        <div :class="{
          'text-green-500': type === 'success',
          'text-orange-500': type === 'warning',
          'text-red-500': type === 'error'
        }">
          <CheckCircle v-if="type === 'success'" class="w-6 h-6" />
          <AlertTriangle v-else-if="type === 'warning'" class="w-6 h-6" />
          <XCircle v-else class="w-6 h-6" />
        </div>
        
        <p class="flex-grow text-sm font-medium text-gray-900 leading-relaxed">{{ message }}</p>
        
        <button @click="close" class="p-1 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-600">
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </transition>
</template>

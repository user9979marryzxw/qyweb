<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

defineProps<{
  id: number | string;
  category: string;
  title: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
}>()
</script>

<template>
  <div class="card-premium bg-white group cursor-pointer" @click="$router.push('/product/' + id)">
    <div class="aspect-[4/3] overflow-hidden">
      <img :src="image" :alt="title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    </div>
    <div class="p-6">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-brand-green px-2 py-1 bg-brand-green/5 rounded-md">{{ category }}</span>
        <span v-if="rating" class="text-sm font-medium text-brand-slate">{{ rating }} ★</span>
      </div>
      <h4 class="text-lg font-bold mb-2 line-clamp-1">{{ title }}</h4>
      <p class="text-brand-slate text-sm mb-6 line-clamp-2">{{ description }}</p>
      <div class="flex items-center justify-between">
        <span class="text-xl font-bold text-brand-green">¥ {{ price.toLocaleString() }} <span class="text-xs font-normal text-brand-slate">/人起</span></span>
        <button class="btn-primary text-sm px-4 py-2">立即预订</button>
      </div>
    </div>
  </div>
</template>

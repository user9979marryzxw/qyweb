<script setup lang="ts">
// No complex logic needed here for now
</script>

<template>
  <div class="antialiased font-sans text-gray-900 bg-background min-h-screen">
    <router-view v-slot="{ Component }">
      <transition 
        mode="out-in"
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
/* Global styles can be added here if needed, but we use main.css */
</style>

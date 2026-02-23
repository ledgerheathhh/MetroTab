<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useConfigStore } from '@/stores/config'
import BackgroundLayer from '@/components/widgets/BackgroundLayer.vue'

const configStore = useConfigStore()

const shellClass = computed(() => ({
  dark: configStore.config.theme === 'dark'
}))
</script>

<template>
  <div class="relative min-h-screen overflow-hidden" :class="shellClass">
    <BackgroundLayer />
    <div class="relative z-10 px-4 py-5 sm:px-6 lg:px-8">
      <RouterView />
    </div>
  </div>
</template>

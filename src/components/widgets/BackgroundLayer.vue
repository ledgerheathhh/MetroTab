<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()

const backdropStyle = computed(() => {
  const wallpaper = configStore.config.wallpaper

  if (wallpaper.mode === 'image' && wallpaper.imageUrl) {
    return {
      backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.42), rgba(2, 6, 23, 0.42)), url(${wallpaper.imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }

  if (wallpaper.mode === 'solid') {
    return {
      background: wallpaper.solidColor
    }
  }

  return {
    background:
      'radial-gradient(circle at 8% 12%, rgba(56, 189, 248, 0.45), transparent 40%), radial-gradient(circle at 85% 15%, rgba(129, 140, 248, 0.38), transparent 36%), radial-gradient(circle at 45% 88%, rgba(251, 191, 36, 0.26), transparent 44%), linear-gradient(145deg, #0f172a 0%, #111827 38%, #172554 100%)'
  }
})
</script>

<template>
  <div class="pointer-events-none fixed inset-0">
    <div class="absolute inset-0" :style="backdropStyle"></div>
    <div class="absolute inset-0 backdrop-blur-[2px]"></div>
  </div>
</template>

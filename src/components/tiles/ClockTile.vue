<script setup lang="ts">
import { computed } from 'vue'
import { useNow } from '@vueuse/core'
import BaseTile from './BaseTile.vue'
import type { ClockContent, TileItem } from '@/types/tile'

const props = defineProps<{
  tile: TileItem
  editing: boolean
  showSeconds: boolean
}>()

const emit = defineEmits<{
  remove: [id: string]
  resize: [id: string]
  shift: [id: string, dx: number, dy: number]
}>()

const now = useNow({ interval: 1000 })

const timeText = computed(() => {
  const content = props.tile.content as ClockContent
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(props.showSeconds ? { second: '2-digit' } : {}),
    timeZone: content.timezone || undefined
  }

  return new Intl.DateTimeFormat('zh-CN', options).format(now.value)
})

const dateText = computed(() =>
  new Intl.DateTimeFormat('zh-CN', {
    weekday: 'short',
    month: 'long',
    day: 'numeric'
  }).format(now.value)
)
</script>

<template>
  <BaseTile
    :tile="props.tile"
    :editing="props.editing"
    @remove="emit('remove', $event)"
    @resize="emit('resize', $event)"
    @shift="(id, dx, dy) => emit('shift', id, dx, dy)"
  >
    <div class="tile-body">
      <span class="text-xs uppercase tracking-[0.18em] text-white/85">{{ (props.tile.content as ClockContent).title || 'Clock' }}</span>
      <div class="mt-auto">
        <p class="text-3xl font-semibold leading-none text-white md:text-4xl">{{ timeText }}</p>
        <p class="mt-2 text-sm text-white/80">{{ dateText }}</p>
      </div>
    </div>
  </BaseTile>
</template>

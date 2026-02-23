<script setup lang="ts">
import type { TileItem } from '@/types/tile'

const props = defineProps<{
  tile: TileItem
  editing: boolean
}>()

const emit = defineEmits<{
  remove: [id: string]
  resize: [id: string]
  shift: [id: string, dx: number, dy: number]
}>()

function accentColor(): string {
  const content = props.tile.content as { bgColor?: string }
  return content.bgColor || '#1d4ed8'
}
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-2xl border border-white/25 bg-slate-900/65 shadow-tile"
    :style="{ background: accentColor() }"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-white/18 via-white/4 to-transparent"></div>

    <div class="relative z-10 h-full">
      <slot></slot>
    </div>

    <div
      v-if="props.editing"
      class="absolute right-2 top-2 z-20 flex gap-1 rounded-xl border border-white/20 bg-slate-900/60 p-1"
    >
      <button class="metro-action" type="button" @click="emit('shift', props.tile.id, -1, 0)">←</button>
      <button class="metro-action" type="button" @click="emit('shift', props.tile.id, 1, 0)">→</button>
      <button class="metro-action" type="button" @click="emit('shift', props.tile.id, 0, -1)">↑</button>
      <button class="metro-action" type="button" @click="emit('shift', props.tile.id, 0, 1)">↓</button>
      <button class="metro-action" type="button" @click="emit('resize', props.tile.id)">Size</button>
      <button class="metro-action danger" type="button" @click="emit('remove', props.tile.id)">X</button>
    </div>
  </article>
</template>

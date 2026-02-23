<script setup lang="ts">
import { computed } from 'vue'
import ShortcutTile from '@/components/tiles/ShortcutTile.vue'
import ClockTile from '@/components/tiles/ClockTile.vue'
import TodoTile from '@/components/tiles/TodoTile.vue'
import type { TileItem } from '@/types/tile'
import { toGridStyle } from '@/utils/tiles'

const props = defineProps<{
  tiles: TileItem[]
  editing: boolean
  showSeconds: boolean
}>()

const emit = defineEmits<{
  remove: [id: string]
  resize: [id: string]
  shift: [id: string, dx: number, dy: number]
  openShortcut: [url: string]
  toggleTodo: [tileId: string, todoId: string]
}>()

const componentMap = {
  shortcut: ShortcutTile,
  clock: ClockTile,
  todo: TodoTile
} as const

const tileList = computed(() => props.tiles)

function resolveComponent(tile: TileItem) {
  return componentMap[tile.type as keyof typeof componentMap] || ShortcutTile
}
</script>

<template>
  <section class="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-8 md:auto-rows-[84px]" aria-label="Tile board">
    <div v-for="tile in tileList" :key="tile.id" :style="toGridStyle(tile)">
      <component
        :is="resolveComponent(tile)"
        :tile="tile"
        :editing="props.editing"
        :show-seconds="props.showSeconds"
        class="h-full min-h-[130px] md:min-h-full"
        @remove="emit('remove', $event)"
        @resize="emit('resize', $event)"
        @shift="(id, dx, dy) => emit('shift', id, dx, dy)"
        @open="emit('openShortcut', $event)"
        @toggle-todo="(tileId, todoId) => emit('toggleTodo', tileId, todoId)"
      />
    </div>
  </section>
</template>

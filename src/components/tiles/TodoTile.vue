<script setup lang="ts">
import BaseTile from './BaseTile.vue'
import type { TileItem, TodoContent } from '@/types/tile'

const props = defineProps<{
  tile: TileItem
  editing: boolean
}>()

const emit = defineEmits<{
  remove: [id: string]
  resize: [id: string]
  shift: [id: string, dx: number, dy: number]
  toggleTodo: [tileId: string, todoId: string]
}>()
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
      <h3 class="text-sm font-semibold tracking-wide text-white">
        {{ (props.tile.content as TodoContent).title }}
      </h3>

      <ul class="mt-2 space-y-2">
        <li v-for="item in (props.tile.content as TodoContent).items" :key="item.id">
          <label class="flex items-center gap-2 text-xs text-white/90">
            <input
              :checked="item.done"
              class="size-3 rounded border-white/40 bg-transparent"
              type="checkbox"
              @change="emit('toggleTodo', props.tile.id, item.id)"
            />
            <span :class="item.done ? 'line-through opacity-70' : ''">{{ item.text }}</span>
          </label>
        </li>
      </ul>
    </div>
  </BaseTile>
</template>

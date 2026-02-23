<script setup lang="ts">
import BaseTile from './BaseTile.vue'
import type { ShortcutContent, TileItem } from '@/types/tile'

const props = defineProps<{
  tile: TileItem
  editing: boolean
}>()

const emit = defineEmits<{
  remove: [id: string]
  resize: [id: string]
  shift: [id: string, dx: number, dy: number]
  open: [url: string]
}>()

function openShortcut() {
  if (props.editing) return

  const content = props.tile.content as ShortcutContent
  emit('open', content.url)
}
</script>

<template>
  <BaseTile
    :tile="props.tile"
    :editing="props.editing"
    @remove="emit('remove', $event)"
    @resize="emit('resize', $event)"
    @shift="(id, dx, dy) => emit('shift', id, dx, dy)"
  >
    <button class="tile-body" type="button" @click="openShortcut">
      <span class="tile-icon">{{ (props.tile.content as ShortcutContent).icon || '::' }}</span>
      <div class="tile-copy">
        <h3>{{ (props.tile.content as ShortcutContent).title }}</h3>
        <p>{{ (props.tile.content as ShortcutContent).description || (props.tile.content as ShortcutContent).url }}</p>
      </div>
    </button>
  </BaseTile>
</template>

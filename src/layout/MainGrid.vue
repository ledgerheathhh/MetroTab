<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { GridStack, type GridItemHTMLElement, type GridStackNode } from 'gridstack'
import ShortcutTile from '@/components/tiles/ShortcutTile.vue'
import ClockTile from '@/components/tiles/ClockTile.vue'
import TodoTile from '@/components/tiles/TodoTile.vue'
import type { TileItem } from '@/types/tile'

interface LayoutPatch {
  id: string
  x: number
  y: number
  w: number
  h: number
}

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
  layoutChange: [patches: LayoutPatch[]]
}>()

const componentMap = {
  shortcut: ShortcutTile,
  clock: ClockTile,
  todo: TodoTile
} as const

const gridRef = ref<HTMLElement | null>(null)

let grid: GridStack | null = null
let syncingFromProps = false

function resolveComponent(tile: TileItem) {
  return componentMap[tile.type as keyof typeof componentMap] || ShortcutTile
}

function getItemElement(id: string): GridItemHTMLElement | null {
  if (!gridRef.value) return null

  return gridRef.value.querySelector(`.grid-stack-item[gs-id=\"${id}\"]`) as GridItemHTMLElement | null
}

function syncGridFromProps() {
  if (!grid || !gridRef.value) return

  syncingFromProps = true
  grid.batchUpdate(true)

  const ids = new Set(props.tiles.map((tile) => tile.id))
  const existingIds = new Set(grid.engine.nodes.map((node) => String(node.id || '')))

  for (const tile of props.tiles) {
    const el = getItemElement(tile.id)
    if (!el) continue

    if (!existingIds.has(tile.id)) {
      grid.makeWidget(el)
    }

    grid.update(el, {
      x: tile.x,
      y: tile.y,
      w: tile.w,
      h: tile.h,
      id: tile.id
    })
  }

  for (const node of [...grid.engine.nodes]) {
    const id = String(node.id || '')
    if (!ids.has(id) && node.el) {
      grid.removeWidget(node.el, false)
    }
  }

  grid.batchUpdate(false)

  queueMicrotask(() => {
    syncingFromProps = false
  })
}

function onGridChange(_event: Event, items: GridStackNode[]) {
  if (syncingFromProps) return

  const patches: LayoutPatch[] = []

  for (const item of items) {
    const id = String(item.id || item.el?.getAttribute('gs-id') || '')
    if (!id) continue

    if (
      typeof item.x !== 'number' ||
      typeof item.y !== 'number' ||
      typeof item.w !== 'number' ||
      typeof item.h !== 'number'
    ) {
      continue
    }

    patches.push({
      id,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h
    })
  }

  if (patches.length) {
    emit('layoutChange', patches)
  }
}

onMounted(async () => {
  if (!gridRef.value) return

  grid = GridStack.init(
    {
      column: 8,
      margin: 12,
      cellHeight: 84,
      float: true,
      animate: true,
      disableDrag: !props.editing,
      disableResize: !props.editing,
      columnOpts: {
        breakpoints: [
          { w: 640, c: 2 },
          { w: 1024, c: 4 },
          { w: 1280, c: 8 }
        ]
      },
      draggable: {
        handle: '.tile-drag-handle'
      }
    },
    gridRef.value
  )

  grid.on('change', onGridChange)

  await nextTick()
  syncGridFromProps()
})

onBeforeUnmount(() => {
  if (!grid) return

  grid.off('change', onGridChange)
  grid.destroy(false)
  grid = null
})

watch(
  () => props.editing,
  (editing) => {
    if (!grid) return

    grid.enableMove(editing)
    grid.enableResize(editing)
  }
)

watch(
  () => props.tiles.map((tile) => `${tile.id}:${tile.x}:${tile.y}:${tile.w}:${tile.h}`).join('|'),
  async () => {
    await nextTick()
    syncGridFromProps()
  },
  { immediate: true }
)
</script>

<template>
  <section class="mx-auto max-w-7xl" aria-label="Tile board">
    <div ref="gridRef" class="grid-stack metrotab-grid">
      <div
        v-for="tile in props.tiles"
        :key="tile.id"
        class="grid-stack-item"
        :gs-id="tile.id"
        :gs-x="tile.x"
        :gs-y="tile.y"
        :gs-w="tile.w"
        :gs-h="tile.h"
      >
        <div class="grid-stack-item-content">
          <component
            :is="resolveComponent(tile)"
            :tile="tile"
            :editing="props.editing"
            :show-seconds="props.showSeconds"
            class="h-full"
            @remove="emit('remove', $event)"
            @resize="emit('resize', $event)"
            @shift="(id, dx, dy) => emit('shift', id, dx, dy)"
            @open="emit('openShortcut', $event)"
            @toggle-todo="(tileId, todoId) => emit('toggleTodo', tileId, todoId)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.metrotab-grid {
  min-height: 72vh;
}

.metrotab-grid :deep(.grid-stack-item-content) {
  inset: 0;
  overflow: visible;
  background: transparent;
}

.metrotab-grid :deep(.ui-resizable-handle) {
  opacity: 0.9;
}
</style>

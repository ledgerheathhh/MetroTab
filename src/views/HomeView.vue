<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/layout/AppHeader.vue'
import MainGrid from '@/layout/MainGrid.vue'
import SettingsDrawer from '@/layout/SettingsDrawer.vue'
import { useEditMode } from '@/composables/useEditMode'
import { useBoardStore } from '@/stores/board'
import { useConfigStore } from '@/stores/config'
import { buildSearchUrl, isLikelyUrl, normalizeUrl } from '@/utils/search'

const boardStore = useBoardStore()
const configStore = useConfigStore()

const { editing, toggleEditing } = useEditMode(false)
const showSettings = ref(false)

function handleSearch(value: string) {
  const query = value.trim()
  if (!query) return

  const targetUrl = isLikelyUrl(query)
    ? normalizeUrl(query)
    : buildSearchUrl(configStore.config.searchEngine, query)

  window.location.href = targetUrl
}

function handleOpenShortcut(url: string) {
  window.open(normalizeUrl(url), '_blank', 'noopener,noreferrer')
}

function handleAddShortcut() {
  const title = window.prompt('Tile title')?.trim()
  if (!title) return

  const url = window.prompt('Tile URL')?.trim()
  if (!url) return

  const description = window.prompt('Description (optional)')?.trim()

  boardStore.addShortcutTile({
    title,
    url: normalizeUrl(url),
    description
  })
}

function handleLayoutChange(patches: Array<{ id: string; x: number; y: number; w: number; h: number }>) {
  for (const patch of patches) {
    boardStore.updateTileLayout(patch.id, patch)
  }
}
</script>

<template>
  <div>
    <AppHeader
      :tile-count="boardStore.tiles.length"
      :editing="editing"
      @search="handleSearch"
      @add-shortcut="handleAddShortcut"
      @toggle-editing="toggleEditing"
      @open-settings="showSettings = true"
    />

    <MainGrid
      :tiles="boardStore.sortedTiles"
      :editing="editing"
      :show-seconds="configStore.config.showSeconds"
      @open-shortcut="handleOpenShortcut"
      @remove="boardStore.removeTile"
      @resize="boardStore.cycleTileSize"
      @shift="(id, dx, dy) => boardStore.moveTile(id, dx, dy)"
      @toggle-todo="(tileId, todoId) => boardStore.toggleTodoDone(tileId, todoId)"
      @layout-change="handleLayoutChange"
    />

    <SettingsDrawer :open="showSettings" @close="showSettings = false" />
  </div>
</template>

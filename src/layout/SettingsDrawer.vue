<script setup lang="ts">
import { computed } from 'vue'
import { useBoardStore } from '@/stores/board'
import { useConfigStore } from '@/stores/config'
import type { AppConfig, SearchEngine } from '@/types/config'
import type { TileItem } from '@/types/tile'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const boardStore = useBoardStore()
const configStore = useConfigStore()

const searchEngine = computed({
  get: () => configStore.config.searchEngine,
  set: (value: SearchEngine) => configStore.setSearchEngine(value)
})

function download(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function exportAll() {
  download('metrotab-board.json', {
    board: boardStore.exportBoard(),
    config: configStore.exportConfig()
  })
}

function onImport(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    try {
      const text = String(reader.result || '')
      const parsed = JSON.parse(text) as {
        board?: { tiles?: TileItem[] }
        config?: { config?: AppConfig }
      }

      if (parsed.board?.tiles) {
        boardStore.importBoard(parsed.board.tiles)
      }

      if (parsed.config?.config) {
        configStore.importConfig(parsed.config.config)
      }
    } catch (error) {
      window.alert(`Import failed: ${(error as Error).message}`)
    }
  }

  reader.readAsText(file)
}
</script>

<template>
  <div v-if="props.open" class="fixed inset-0 z-40 bg-slate-950/50" @click.self="emit('close')">
    <aside class="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white p-5 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <header class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold">Settings</h2>
        <button class="metro-btn" type="button" @click="emit('close')">Close</button>
      </header>

      <section class="space-y-3 border-b border-slate-200 pb-4 dark:border-slate-700">
        <h3 class="font-medium">Theme</h3>
        <div class="flex gap-2">
          <button class="metro-btn" type="button" @click="configStore.setTheme('light')">Light</button>
          <button class="metro-btn" type="button" @click="configStore.setTheme('dark')">Dark</button>
          <button class="metro-btn" type="button" @click="configStore.toggleTheme()">Toggle</button>
        </div>
      </section>

      <section class="space-y-3 border-b border-slate-200 py-4 dark:border-slate-700">
        <h3 class="font-medium">Search Engine</h3>
        <select v-model="searchEngine" class="metro-input">
          <option value="bing">Bing</option>
          <option value="google">Google</option>
          <option value="baidu">Baidu</option>
          <option value="duckduckgo">DuckDuckGo</option>
          <option value="github">GitHub</option>
        </select>
      </section>

      <section class="space-y-3 border-b border-slate-200 py-4 dark:border-slate-700">
        <h3 class="font-medium">Clock</h3>
        <label class="flex items-center gap-2 text-sm">
          <input
            :checked="configStore.config.showSeconds"
            type="checkbox"
            @change="configStore.setShowSeconds(!configStore.config.showSeconds)"
          />
          Show seconds
        </label>
      </section>

      <section class="space-y-3 border-b border-slate-200 py-4 dark:border-slate-700">
        <h3 class="font-medium">Wallpaper</h3>
        <select class="metro-input" :value="configStore.config.wallpaper.mode" @change="configStore.setWallpaperMode(($event.target as HTMLSelectElement).value as AppConfig['wallpaper']['mode'])">
          <option value="gradient">Gradient</option>
          <option value="image">Image URL</option>
          <option value="solid">Solid Color</option>
        </select>

        <input
          class="metro-input"
          :value="configStore.config.wallpaper.imageUrl"
          placeholder="https://images.unsplash.com/..."
          type="url"
          @input="configStore.setWallpaperImage(($event.target as HTMLInputElement).value)"
        />

        <input
          class="metro-input h-10"
          :value="configStore.config.wallpaper.solidColor"
          type="color"
          @input="configStore.setSolidColor(($event.target as HTMLInputElement).value)"
        />
      </section>

      <section class="space-y-3 py-4">
        <h3 class="font-medium">Backup</h3>
        <div class="flex gap-2">
          <button class="metro-btn-primary" type="button" @click="exportAll">Export JSON</button>
          <label class="metro-btn cursor-pointer">
            Import JSON
            <input class="hidden" type="file" accept="application/json" @change="onImport" />
          </label>
        </div>
      </section>

      <footer class="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
        <button
          class="w-full rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white"
          type="button"
          @click="() => { boardStore.resetBoard(); configStore.resetConfig() }"
        >
          Reset All
        </button>
      </footer>
    </aside>
  </div>
</template>

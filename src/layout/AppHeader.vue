<script setup lang="ts">
import { computed } from 'vue'
import { useNow } from '@vueuse/core'
import SearchHub from '@/components/widgets/SearchHub.vue'
import { useConfigStore } from '@/stores/config'

const props = defineProps<{
  tileCount: number
  editing: boolean
}>()

const emit = defineEmits<{
  search: [query: string]
  addShortcut: []
  toggleEditing: []
  openSettings: []
}>()

const configStore = useConfigStore()
const now = useNow({ interval: 1000 })

const dateText = computed(() =>
  new Intl.DateTimeFormat('zh-CN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(now.value)
)

function updateSearchEngine(value: typeof configStore.config.searchEngine) {
  configStore.setSearchEngine(value)
}
</script>

<template>
  <header class="acrylic-bg mx-auto mb-5 flex max-w-7xl flex-col gap-4 rounded-2xl p-4 md:p-5">
    <div class="flex flex-wrap items-center justify-between gap-3 text-slate-100">
      <div>
        <h1 class="text-2xl font-semibold tracking-wide">MetroTab</h1>
        <p class="text-sm text-slate-200/90">{{ dateText }} · {{ props.tileCount }} tiles</p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button class="metro-btn" type="button" @click="emit('addShortcut')">Add Tile</button>
        <button class="metro-btn" type="button" @click="emit('toggleEditing')">
          {{ props.editing ? 'Done' : 'Edit' }}
        </button>
        <button class="metro-btn-primary" type="button" @click="emit('openSettings')">Settings</button>
      </div>
    </div>

    <SearchHub
      :search-engine="configStore.config.searchEngine"
      @search="emit('search', $event)"
      @update:search-engine="updateSearchEngine"
    />
  </header>
</template>

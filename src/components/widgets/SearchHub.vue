<script setup lang="ts">
import { ref } from 'vue'
import type { SearchEngine } from '@/types/config'

const props = defineProps<{
  searchEngine: SearchEngine
}>()

const emit = defineEmits<{
  search: [value: string]
  'update:searchEngine': [engine: SearchEngine]
}>()

const keyword = ref('')

function submit() {
  emit('search', keyword.value)
}
</script>

<template>
  <form class="flex w-full items-center gap-2" @submit.prevent="submit">
    <input
      v-model="keyword"
      class="h-11 w-full rounded-xl border border-white/25 bg-white/65 px-4 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-400 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-400"
      placeholder="Search or type a URL"
      type="search"
    />

    <select
      :value="props.searchEngine"
      class="h-11 min-w-24 rounded-xl border border-white/25 bg-white/65 px-2 text-sm text-slate-900 outline-none dark:bg-slate-800/60 dark:text-slate-100"
      @change="emit('update:searchEngine', ($event.target as HTMLSelectElement).value as SearchEngine)"
    >
      <option value="bing">Bing</option>
      <option value="google">Google</option>
      <option value="baidu">Baidu</option>
      <option value="duckduckgo">DuckDuckGo</option>
      <option value="github">GitHub</option>
    </select>

    <button class="metro-btn-primary h-11 rounded-xl px-4" type="submit">Search</button>
  </form>
</template>

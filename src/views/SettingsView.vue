<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/20 bg-white/75 p-6 text-slate-800 backdrop-blur-md dark:bg-slate-900/70 dark:text-slate-100">
    <h2 class="text-2xl font-semibold">Settings Page (Reserved)</h2>
    <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">
      当前项目使用右侧抽屉作为主要设置入口，这个页面用于后续扩展更复杂配置（账号同步、模板管理、扩展市场）。
    </p>

    <button class="metro-btn mt-5" type="button" @click="router.push('/')">Back to Home</button>
  </div>
</template>

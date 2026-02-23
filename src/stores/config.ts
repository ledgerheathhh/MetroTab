import { defineStore } from 'pinia'
import { useDark, useLocalStorage, useToggle } from '@vueuse/core'
import type { AppConfig, ConfigExportData, SearchEngine, ThemeMode } from '@/types/config'

const DEFAULT_CONFIG: AppConfig = {
  theme: 'light',
  searchEngine: 'bing',
  showSeconds: false,
  wallpaper: {
    mode: 'gradient',
    imageUrl: '',
    solidColor: '#0b1220'
  }
}

export const useConfigStore = defineStore('config', () => {
  const config = useLocalStorage<AppConfig>('metrotab.config', { ...DEFAULT_CONFIG }, { mergeDefaults: true })

  const isDark = useDark({
    storageKey: 'metrotab.dark',
    valueDark: 'dark',
    valueLight: 'light',
    initialValue: config.value.theme === 'dark' ? 'dark' : 'light'
  })

  const toggleDark = useToggle(isDark)

  function setTheme(theme: ThemeMode) {
    config.value.theme = theme
    isDark.value = theme === 'dark'
  }

  function toggleTheme() {
    toggleDark()
    config.value.theme = isDark.value ? 'dark' : 'light'
  }

  function setSearchEngine(engine: SearchEngine) {
    config.value.searchEngine = engine
  }

  function setShowSeconds(value: boolean) {
    config.value.showSeconds = value
  }

  function setWallpaperMode(mode: AppConfig['wallpaper']['mode']) {
    config.value.wallpaper.mode = mode
  }

  function setWallpaperImage(url: string) {
    config.value.wallpaper.imageUrl = url
  }

  function setSolidColor(color: string) {
    config.value.wallpaper.solidColor = color
  }

  function resetConfig() {
    config.value = JSON.parse(JSON.stringify(DEFAULT_CONFIG)) as AppConfig
    isDark.value = false
  }

  function exportConfig(): ConfigExportData {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      config: JSON.parse(JSON.stringify(config.value)) as AppConfig
    }
  }

  function importConfig(next: AppConfig) {
    config.value = JSON.parse(JSON.stringify(next)) as AppConfig
    isDark.value = config.value.theme === 'dark'
  }

  return {
    config,
    isDark,
    setTheme,
    toggleTheme,
    setSearchEngine,
    setShowSeconds,
    setWallpaperMode,
    setWallpaperImage,
    setSolidColor,
    resetConfig,
    exportConfig,
    importConfig
  }
})

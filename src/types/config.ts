export type ThemeMode = 'light' | 'dark'

export type SearchEngine = 'bing' | 'google' | 'baidu' | 'duckduckgo' | 'github'

export interface AppConfig {
  theme: ThemeMode
  searchEngine: SearchEngine
  showSeconds: boolean
  wallpaper: {
    mode: 'gradient' | 'image' | 'solid'
    imageUrl: string
    solidColor: string
  }
}

export interface ConfigExportData {
  version: 1
  exportedAt: string
  config: AppConfig
}

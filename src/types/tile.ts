export type TileSize = '1x1' | '2x2' | '4x2' | '4x4'

export type TileType = 'shortcut' | 'clock' | 'weather' | 'todo'

export interface ShortcutContent {
  title: string
  url: string
  icon?: string
  bgColor?: string
  description?: string
}

export interface TodoItem {
  id: string
  text: string
  done: boolean
}

export interface TodoContent {
  title: string
  items: TodoItem[]
  bgColor?: string
}

export interface ClockContent {
  title?: string
  timezone?: string
  bgColor?: string
}

export interface WeatherContent {
  title: string
  temperature?: string
  weatherText?: string
  bgColor?: string
}

export type TileContent = ShortcutContent | TodoContent | ClockContent | WeatherContent

export interface TileItem {
  id: string
  type: TileType
  size: TileSize
  x: number
  y: number
  w: number
  h: number
  content: TileContent
}

export interface BoardExportData {
  version: 1
  exportedAt: string
  tiles: TileItem[]
}

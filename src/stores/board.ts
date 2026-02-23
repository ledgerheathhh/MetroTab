import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { BoardExportData, TileItem, TileSize, TodoContent } from '@/types/tile'
import { nextTileSize, resolveSize } from '@/utils/tiles'

const DEFAULT_TILES: TileItem[] = [
  {
    id: 'shortcut-github',
    type: 'shortcut',
    size: '2x2',
    x: 0,
    y: 0,
    w: 2,
    h: 2,
    content: {
      title: 'GitHub',
      url: 'https://github.com',
      icon: 'GH',
      description: 'Repo & issue tracking',
      bgColor: '#111827'
    }
  },
  {
    id: 'clock-main',
    type: 'clock',
    size: '4x2',
    x: 2,
    y: 0,
    w: 4,
    h: 2,
    content: {
      title: 'Local Time',
      timezone: 'Asia/Shanghai',
      bgColor: '#0f766e'
    }
  },
  {
    id: 'shortcut-youtube',
    type: 'shortcut',
    size: '2x2',
    x: 6,
    y: 0,
    w: 2,
    h: 2,
    content: {
      title: 'YouTube',
      url: 'https://www.youtube.com',
      icon: 'YT',
      description: 'Watch later',
      bgColor: '#b91c1c'
    }
  },
  {
    id: 'todo-focus',
    type: 'todo',
    size: '4x4',
    x: 0,
    y: 2,
    w: 4,
    h: 4,
    content: {
      title: 'Today Focus',
      bgColor: '#1d4ed8',
      items: [
        { id: 'todo-1', text: 'Review pull requests', done: false },
        { id: 'todo-2', text: 'Write daily summary', done: true },
        { id: 'todo-3', text: 'Plan tomorrow work', done: false }
      ]
    }
  },
  {
    id: 'shortcut-figma',
    type: 'shortcut',
    size: '2x2',
    x: 4,
    y: 2,
    w: 2,
    h: 2,
    content: {
      title: 'Figma',
      url: 'https://www.figma.com',
      icon: 'FG',
      description: 'Design workspace',
      bgColor: '#7c3aed'
    }
  },
  {
    id: 'shortcut-calendar',
    type: 'shortcut',
    size: '2x2',
    x: 6,
    y: 2,
    w: 2,
    h: 2,
    content: {
      title: 'Calendar',
      url: 'https://calendar.google.com',
      icon: 'CA',
      description: 'Events timeline',
      bgColor: '#0369a1'
    }
  }
]

function cloneTiles(tiles: TileItem[]): TileItem[] {
  return JSON.parse(JSON.stringify(tiles)) as TileItem[]
}

export const useBoardStore = defineStore('board', () => {
  const tiles = useLocalStorage<TileItem[]>('metrotab.tiles', cloneTiles(DEFAULT_TILES), {
    mergeDefaults: true
  })

  const sortedTiles = computed(() =>
    [...tiles.value].sort((a, b) => {
      if (a.y !== b.y) return a.y - b.y
      if (a.x !== b.x) return a.x - b.x
      return a.id.localeCompare(b.id)
    })
  )

  function addShortcutTile(payload: {
    title: string
    url: string
    icon?: string
    description?: string
    bgColor?: string
  }) {
    const maxY = tiles.value.reduce((acc, tile) => Math.max(acc, tile.y + tile.h), 0)

    const tile: TileItem = {
      id: `${Date.now()}`,
      type: 'shortcut',
      size: '2x2',
      x: 0,
      y: maxY,
      w: 2,
      h: 2,
      content: {
        title: payload.title,
        url: payload.url,
        icon: payload.icon || payload.title.slice(0, 2).toUpperCase(),
        description: payload.description,
        bgColor: payload.bgColor || '#334155'
      }
    }

    tiles.value.push(tile)
  }

  function removeTile(id: string) {
    tiles.value = tiles.value.filter((tile) => tile.id !== id)
  }

  function updateTileLayout(
    id: string,
    patch: Partial<Pick<TileItem, 'x' | 'y' | 'w' | 'h' | 'size'>>
  ) {
    const target = tiles.value.find((tile) => tile.id === id)
    if (!target) return

    Object.assign(target, patch)
  }

  function moveTile(id: string, dx: number, dy: number) {
    const target = tiles.value.find((tile) => tile.id === id)
    if (!target) return

    target.x = Math.max(0, Math.min(7, target.x + dx))
    target.y = Math.max(0, target.y + dy)
  }

  function cycleTileSize(id: string) {
    const target = tiles.value.find((tile) => tile.id === id)
    if (!target) return

    const next: TileSize = nextTileSize(target.size)
    const nextGrid = resolveSize(next)

    target.size = next
    target.w = nextGrid.w
    target.h = nextGrid.h
  }

  function toggleTodoDone(id: string, itemId: string) {
    const target = tiles.value.find((tile) => tile.id === id)
    if (!target || target.type !== 'todo') return

    const content = target.content as TodoContent
    content.items = content.items.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    )
  }

  function resetBoard() {
    tiles.value = cloneTiles(DEFAULT_TILES)
  }

  function exportBoard(): BoardExportData {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      tiles: cloneTiles(tiles.value)
    }
  }

  function importBoard(next: TileItem[]) {
    if (!Array.isArray(next)) return
    tiles.value = cloneTiles(next)
  }

  return {
    tiles,
    sortedTiles,
    addShortcutTile,
    removeTile,
    updateTileLayout,
    moveTile,
    cycleTileSize,
    toggleTodoDone,
    resetBoard,
    exportBoard,
    importBoard
  }
})

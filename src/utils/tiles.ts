import type { TileItem, TileSize } from '@/types/tile'

const SIZE_MAP: Record<TileSize, { w: number; h: number }> = {
  '1x1': { w: 1, h: 1 },
  '2x2': { w: 2, h: 2 },
  '4x2': { w: 4, h: 2 },
  '4x4': { w: 4, h: 4 }
}

const SIZE_ORDER: TileSize[] = ['1x1', '2x2', '4x2', '4x4']

export function resolveSize(size: TileSize): { w: number; h: number } {
  return SIZE_MAP[size]
}

export function nextTileSize(size: TileSize): TileSize {
  const idx = SIZE_ORDER.indexOf(size)
  return SIZE_ORDER[(idx + 1) % SIZE_ORDER.length]
}

export function toGridStyle(tile: TileItem): Record<string, string> {
  return {
    gridColumn: `${tile.x + 1} / span ${tile.w}`,
    gridRow: `${tile.y + 1} / span ${tile.h}`
  }
}

import type { TileItem, TileSize, TileType } from '@/types/tile'

const SIZE_MAP: Record<TileSize, { w: number; h: number }> = {
  '1x1': { w: 1, h: 1 },
  '2x2': { w: 2, h: 2 },
  '4x2': { w: 4, h: 2 },
  '4x4': { w: 4, h: 4 }
}

const SIZE_ORDER: TileSize[] = ['1x1', '2x2', '4x2', '4x4']

const TYPE_SIZE_MAP: Record<TileType, TileSize[]> = {
  shortcut: ['1x1', '2x2', '4x2'],
  clock: ['4x2', '4x4'],
  weather: ['2x2', '4x2'],
  todo: ['2x2', '4x4']
}

export interface TileSizeConstraint {
  minW: number
  minH: number
  maxW: number
  maxH: number
  sizes: TileSize[]
}

export function resolveSize(size: TileSize): { w: number; h: number } {
  return SIZE_MAP[size]
}

export function getAllowedSizes(type: TileType): TileSize[] {
  return TYPE_SIZE_MAP[type]
}

export function getSizeConstraint(type: TileType): TileSizeConstraint {
  const sizes = getAllowedSizes(type)
  const spans = sizes.map((size) => resolveSize(size))

  return {
    minW: Math.min(...spans.map((span) => span.w)),
    minH: Math.min(...spans.map((span) => span.h)),
    maxW: Math.max(...spans.map((span) => span.w)),
    maxH: Math.max(...spans.map((span) => span.h)),
    sizes
  }
}

export function nextTileSize(type: TileType, currentSize: TileSize): TileSize {
  const sizes = getAllowedSizes(type)
  const idx = sizes.indexOf(currentSize)

  if (idx < 0) {
    return sizes[0]
  }

  return sizes[(idx + 1) % sizes.length]
}

export function resolveSizeFromSpan(type: TileType, w: number, h: number, fallback: TileSize): TileSize {
  const sizes = getAllowedSizes(type)

  if (!sizes.length) {
    return fallback
  }

  let closest = sizes[0]
  let closestScore = Number.POSITIVE_INFINITY

  for (const size of sizes) {
    const span = resolveSize(size)
    const score = Math.abs(span.w - w) + Math.abs(span.h - h)

    if (score < closestScore) {
      closest = size
      closestScore = score
    }
  }

  return closest
}

export function toGridStyle(tile: TileItem): Record<string, string> {
  return {
    gridColumn: `${tile.x + 1} / span ${tile.w}`,
    gridRow: `${tile.y + 1} / span ${tile.h}`
  }
}

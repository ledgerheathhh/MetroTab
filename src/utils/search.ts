import type { SearchEngine } from '@/types/config'

const SEARCH_MAP: Record<SearchEngine, string> = {
  bing: 'https://www.bing.com/search?q=',
  google: 'https://www.google.com/search?q=',
  baidu: 'https://www.baidu.com/s?wd=',
  duckduckgo: 'https://duckduckgo.com/?q=',
  github: 'https://github.com/search?q='
}

export function buildSearchUrl(engine: SearchEngine, query: string): string {
  return `${SEARCH_MAP[engine]}${encodeURIComponent(query)}`
}

export function normalizeUrl(raw: string): string {
  if (/^https?:\/\//i.test(raw)) {
    return raw
  }

  return `https://${raw}`
}

export function isLikelyUrl(input: string): boolean {
  const source = input.trim()
  if (!source) return false

  if (/^https?:\/\//i.test(source)) return true

  return source.includes('.') && !source.includes(' ')
}

import type { DataOptions } from './media'
import type { VideoInfo, DependenciesStatus, Status, CacheStats } from './any'
import type { FormatVideoDefault, FormatAudioDefault, FormatVideoYT, FormatAudioYT } from './json'

interface SaveMediaOptions {
  dir: string
  fileName: string
  cover?: boolean
  metadata?: boolean
}

interface Cache {
  path: string
  getStats(): CacheStats
  clear(): void
}

interface Dependecies {
  status(): Promise<DependenciesStatus>
}

export declare class DLP {
  addURL(url: string): Promise<void>
  getMedia(options: DataOptions): Promise<void>
  getMediaSizeTotal(options: DataOptions): string
  saveMedia(options: SaveMediaOptions): Promise<void>
  get status(): Status
  get info(): VideoInfo
  get formats(): {
    audio?:
      | FormatAudioDefault[]
      | FormatAudioYT
      | FormatAudioDefault
      | { [key: string]: FormatAudioYT[] }
      | null
    mp4: FormatVideoDefault[] | FormatVideoYT[]
    webm?: FormatVideoYT[] | null
  }
  isAudioAvailable(): boolean
}

export const Cache: Cache
export const Dependecies: Dependecies

declare const _default: {
  DLP: typeof DLP
  Dependecies: Dependecies
  Cache: Cache
}

export default _default

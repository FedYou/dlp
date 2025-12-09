import type { DataOptions } from './media'
import type { VideoInfo, DependenciesStatus, DownloadStatus, CacheStats } from './any'
import type { FormatVideo, FormatAudio, FormatAudioLanguages } from './json'

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

interface Dependencies {
  status(): Promise<DependenciesStatus>
}

export declare class DLP {
  addURL(url: string): Promise<void>
  getMedia(options: DataOptions): Promise<void>
  getMediaSizeTotal(options: DataOptions): string
  saveMedia(options: SaveMediaOptions): Promise<void>
  get downloadStatus(): DownloadStatus
  get info(): VideoInfo
  get formats(): {
    audio: FormatAudio | FormatAudioLanguages | boolean
    mp4: FormatVideo[]
    webm?: FormatVideo[] | null
  }
  isAudioAvailable(): boolean
}

export const Cache: Cache
export const Dependencies: Dependencies

declare const _default: {
  DLP: typeof DLP
  Dependencies: Dependencies
  Cache: Cache
}

export default _default

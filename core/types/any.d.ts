import type { FileDownloadProgress } from './dlf'

export interface VideoInfo {
  title: string
  uploader: string
  description: string
  upload_date: string
  duration: string
  thumbnail: string
  id: string
  platform: string
  /** Youtube */
  views?: number
  /** Youtube */
  language?: string
}

export interface Metadata {
  title: string
  artist: string
  description: string
}

export interface DependencyStatusFormat {
  installed: boolean
  version: string | null
  lastest: boolean | null
}

export interface DependenciesStatusList {
  ytdlp: DependencyStatusFormat
  ffmpeg: DependencyStatusFormat
  deno: DependencyStatusFormat
  aria2: DependencyStatusFormat
}

export interface DependenciesStatus {
  'all-installed': boolean
  list: DependenciesStatusList
}

export interface DownloadStatus {
  type: 'video' | 'audio' | 'thumbnail' | 'none'
  progress: FileDownloadProgress
}

export interface CacheStats {
  unknown: string
  audio: string
  image: string
  video: string
  text: string
  total: string
}
